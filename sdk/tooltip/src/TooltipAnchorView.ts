import { requireNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';

/**
 * viewinjection/fabricviewmanager: wraps the target element and, when `tooltipLabel` is set, draws a
 * tooltip bubble into the wrapper's own overlay natively — mounted inside the RN tree instead of
 * floated over it like the other viewinjection ways.
 */
export interface TooltipAnchorViewProps extends ViewProps {
    tooltipLabel?: string;
}

const TooltipAnchorView = requireNativeComponent<TooltipAnchorViewProps>('MoETooltipAnchorView');

export default TooltipAnchorView;
