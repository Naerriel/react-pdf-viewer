/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '@react-pdf-viewer/core';

export type Zoom = (scale: number | SpecialZoomLevel) => void;
