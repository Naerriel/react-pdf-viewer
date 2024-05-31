/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LayerRenderStatus, type PluginOnTextLayerRender, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HightlightItem } from './HightlightItem';
import { calculateOffset } from './calculateOffset';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import { getCssProperties } from './getCssProperties';
import { type MatchPosition } from './types/MatchPosition';
import { type NormalizedKeyword } from './types/NormalizedKeyword';
import { type OnHighlightKeyword } from './types/OnHighlightKeyword';
import { type HighlightArea, type RenderHighlightsProps } from './types/RenderHighlightsProps';
import { type StoreProps } from './types/StoreProps';
import { unwrap } from './unwrap';

interface RenderStatus {
    ele?: HTMLElement;
    pageIndex: number;
    scale: number;
    status: LayerRenderStatus;
}

interface MatchIndexes {
    keyword: RegExp;
    startIndex: number;
    endIndex: number;
}
interface CharIndex {
    char: string;
    charIndexInSpan: number;
    spanIndex: number;
}

// Sort the highlight elements by their positions
const sortHighlightPosition = (a: HighlightArea, b: HighlightArea) => {
    // Compare the top values first
    if (a.top < b.top) {
        return -1;
    }
    if (a.top > b.top) {
        return 1;
    }
    // Then compare the left values
    if (a.left < b.left) {
        return -1;
    }
    if (a.left > b.left) {
        return 1;
    }
    return 0;
};

export const Highlights: React.FC<{
    numPages: number;
    pageIndex: number;
    renderHighlights?(props: RenderHighlightsProps): React.ReactElement;
    store: Store<StoreProps>;
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}> = ({ numPages, pageIndex, renderHighlights, store, onHighlightKeyword }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const defaultRenderHighlights = React.useCallback((renderProps: RenderHighlightsProps) => {
        return (
            <>
                {renderProps.highlightAreas.map((area, index) => (
                    <HightlightItem index={index} key={index} area={area} onHighlightKeyword={onHighlightKeyword} />
                ))}
            </>
        );
    }, []);
    const renderHighlightElements = renderHighlights || defaultRenderHighlights;

    // The initial matching position is taken from the store
    // So the current highlight is kept (after zooming the document, for example)
    const [matchPosition, setMatchPosition] = React.useState<MatchPosition>(store.get('matchPosition'));
    const [keywordRegexp, setKeywordRegexp] = React.useState<NormalizedKeyword[]>(
        store.get('keyword') || [EMPTY_KEYWORD_REGEXP],
    );
    const [renderStatus, setRenderStatus] = React.useState<RenderStatus>({
        pageIndex,
        scale: 1,
        status: LayerRenderStatus.PreRender,
    });
    const currentMatchRef = React.useRef<HTMLElement[] | null>(null);
    const characterIndexesRef = React.useRef<CharIndex[]>([]);
    const [highlightAreas, setHighlightAreas] = React.useState<HighlightArea[]>([]);

    const defaultTargetPageFilter = () => true;
    const targetPageFilter = React.useCallback(
        () => store.get('targetPageFilter') || defaultTargetPageFilter,
        [store.get('targetPageFilter')],
    );

    const highlight = (
        keywordStr: string,
        keyword: RegExp,
        textLayerEle: Element,
        span: HTMLElement,
        charIndexSpan: CharIndex[],
        matchIndex: number,
    ): HighlightArea | null => {
        const range = document.createRange();

        const firstChild = span.firstChild;
        if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE) {
            return null;
        }

        const length = firstChild.textContent.length;
        const startOffset = charIndexSpan[0].charIndexInSpan;
        const endOffset =
            charIndexSpan.length === 1 ? startOffset : charIndexSpan[charIndexSpan.length - 1].charIndexInSpan;
        if (startOffset > length || endOffset + 1 > length) {
            return null;
        }

        range.setStart(firstChild, startOffset);
        range.setEnd(firstChild, endOffset + 1);

        const wrapper = document.createElement('span');
        range.surroundContents(wrapper);

        const wrapperRect = wrapper.getBoundingClientRect();
        const textLayerRect = textLayerEle.getBoundingClientRect();
        const pageHeight = textLayerRect.height;
        const pageWidth = textLayerRect.width;

        const left = (100 * (wrapperRect.left - textLayerRect.left)) / pageWidth;
        const top = (100 * (wrapperRect.top - textLayerRect.top)) / pageHeight;
        const height = (100 * wrapperRect.height) / pageHeight;
        const width = (100 * wrapperRect.width) / pageWidth;

        unwrap(wrapper);

        return {
            keyword,
            keywordStr,
            numPages,
            pageIndex,
            left,
            top,
            height,
            width,
            pageHeight,
            pageWidth,
            matchIndex,
        };
    };

    const highlightAll = (textLayerEle: Element): HighlightArea[] => {
        const charIndexes = characterIndexesRef.current;
        if (charIndexes.length === 0) {
            return [];
        }

        const highlightPos: HighlightArea[] = [];
        const spans: HTMLElement[] = [].slice.call(textLayerEle.querySelectorAll('.rpv-core__text-layer-text'));

        // Generate the full text of page
        const fullText = charIndexes.map((item) => item.char).join('');

        keywordRegexp.forEach((keyword) => {
            const keywordStr = keyword.keyword;
            if (!keywordStr.trim()) {
                return;
            }

            // Clone the keyword regular expression, and add the global (`g`) flag
            // If the `g` flag is missing, it will lead to an infinitive loop
            const cloneKeyword =
                keyword.regExp.flags.indexOf('g') === -1
                    ? new RegExp(keyword.regExp, `${keyword.regExp.flags}g`)
                    : keyword.regExp;

            // Find all matches in the full text
            let match;
            const matches: MatchIndexes[] = [];
            while ((match = cloneKeyword.exec(fullText)) !== null) {
                matches.push({
                    keyword: cloneKeyword,
                    startIndex: match.index as number,
                    endIndex: cloneKeyword.lastIndex,
                });
            }

            matches
                .map((item) => ({
                    keyword: item.keyword,
                    indexes: charIndexes.slice(item.startIndex, item.endIndex),
                }))
                .forEach((item, matchIndex) => {
                    // Group by the span index
                    const spanIndexes = item.indexes.reduce(
                        (acc, item) => {
                            acc[item.spanIndex] = (acc[item.spanIndex] || ([] as CharIndex[])).concat([item]);
                            return acc;
                        },
                        {} as { [spanIndex: number]: CharIndex[] },
                    );
                    Object.values(spanIndexes).forEach((charIndexSpan) => {
                        // Ignore the space between words
                        if (charIndexSpan.length !== 1 || charIndexSpan[0].char.trim() !== '') {
                            // Ignore the first and last spaces if we are finding the whole word
                            const normalizedCharSpan = keyword.wholeWords ? charIndexSpan.slice(1, -1) : charIndexSpan;
                            const hightlighPosition = highlight(
                                keywordStr,
                                item.keyword,
                                textLayerEle,
                                spans[normalizedCharSpan[0].spanIndex],
                                normalizedCharSpan,
                                matchIndex,
                            );
                            if (hightlighPosition) {
                                highlightPos.push(hightlighPosition);
                            }
                        }
                    });
                });
        });

        // Sort the highlight elements as they appear in the texts
        return highlightPos.sort(sortHighlightPosition);
    };

    const handleKeywordChanged = (keyword?: NormalizedKeyword[]) => {
        if (keyword && keyword.length > 0) {
            setKeywordRegexp(keyword);
        }
    };

    const handleMatchPositionChanged = (currentPosition: MatchPosition) => setMatchPosition(currentPosition);

    const handleRenderStatusChanged = (status: Map<number, PluginOnTextLayerRender>) => {
        if (!status.has(pageIndex)) {
            return;
        }
        const currentStatus = status.get(pageIndex);
        if (currentStatus) {
            setRenderStatus({
                ele: currentStatus.ele,
                pageIndex,
                scale: currentStatus.scale,
                status: currentStatus.status,
            });
        }
    };

    const isEmptyKeyword = () =>
        keywordRegexp.length === 0 || (keywordRegexp.length === 1 && keywordRegexp[0].keyword.trim() === '');

    // Prepare the characters indexes
    // The order of hooks are important. Since `charIndexes` will be used when we highlight matching items,
    // this hook is put at the top
    React.useEffect(() => {
        if (
            isEmptyKeyword() ||
            renderStatus.status !== LayerRenderStatus.DidRender ||
            characterIndexesRef.current.length
        ) {
            return;
        }

        const textLayerEle = renderStatus.ele;
        const spans: HTMLElement[] = [].slice.call(textLayerEle.querySelectorAll('.rpv-core__text-layer-text'));

        const charIndexes: CharIndex[] = spans
            .map((span) => span.textContent)
            .reduce(
                (prev, curr, index) =>
                    prev.concat(
                        curr.split('').map((c, i) => ({
                            char: c,
                            charIndexInSpan: i,
                            spanIndex: index,
                        })),
                    ),
                [
                    {
                        char: '',
                        charIndexInSpan: 0,
                        spanIndex: 0,
                    },
                ],
            )
            .slice(1);

        characterIndexesRef.current = charIndexes;
    }, [keywordRegexp, renderStatus.status]);

    React.useEffect(() => {
        if (
            isEmptyKeyword() ||
            !renderStatus.ele ||
            renderStatus.status !== LayerRenderStatus.DidRender ||
            !targetPageFilter()({ pageIndex, numPages })
        ) {
            return;
        }

        const textLayerEle = renderStatus.ele;
        const highlightPos = highlightAll(textLayerEle);
        setHighlightAreas(highlightPos);
    }, [keywordRegexp, matchPosition, renderStatus.status, characterIndexesRef.current]);

    React.useEffect(() => {
        if (isEmptyKeyword() && renderStatus.ele && renderStatus.status === LayerRenderStatus.DidRender) {
            setHighlightAreas([]);
        }
    }, [keywordRegexp, renderStatus.status]);

    React.useEffect(() => {
        if (highlightAreas.length === 0) {
            return;
        }

        const container = containerRef.current;
        if (
            matchPosition.pageIndex !== pageIndex ||
            !container ||
            renderStatus.status !== LayerRenderStatus.DidRender
        ) {
            return;
        }

        const highlightElements = Array.from(
            container.querySelectorAll(`.rpv-search__highlight[data-match-index="${matchPosition.matchIndex}"]`),
        );
        if (!highlightElements.length) {
            return;
        }
        const firstHighlightElement = highlightElements[0];

        const { left, top } = calculateOffset(firstHighlightElement as HTMLElement, container);
        const jump = store.get('jumpToDestination');
        const currentClassName = 'rpv-search__highlight--current';
        if (jump) {
            const marginTop = 200;
            jump({
                pageIndex,
                bottomOffset: (container.getBoundingClientRect().height - top + marginTop) / renderStatus.scale,
                leftOffset: left / renderStatus.scale,
                scaleTo: renderStatus.scale,
            });
            if (currentMatchRef.current) {
                currentMatchRef.current.forEach((ele) => ele.classList.remove(currentClassName));
            }
            currentMatchRef.current = highlightElements as HTMLElement[];
            highlightElements.forEach((element) => element.classList.add(currentClassName));
        }
    }, [highlightAreas, matchPosition]);

    React.useEffect(() => {
        store.subscribe('keyword', handleKeywordChanged);
        store.subscribe('matchPosition', handleMatchPositionChanged);
        store.subscribe('renderStatus', handleRenderStatusChanged);

        return () => {
            store.unsubscribe('keyword', handleKeywordChanged);
            store.unsubscribe('matchPosition', handleMatchPositionChanged);
            store.unsubscribe('renderStatus', handleRenderStatusChanged);
        };
    }, []);

    return (
        <div className="rpv-search__highlights" data-testid={`search__highlights-${pageIndex}`} ref={containerRef}>
            {renderHighlightElements({
                getCssProperties,
                highlightAreas,
            })}
        </div>
    );
};
