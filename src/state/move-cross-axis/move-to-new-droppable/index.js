// @flow
import { type Position } from 'css-box-model';
import toHomeList from './to-home-list';
import toForeignList from './to-foreign-list';
import { patch } from '../../position';
import type { Result } from '../move-cross-axis-types';
import type {
  DraggableDimension,
  DroppableDimension,
  DraggableLocation,
  DragImpact,
  Viewport,
} from '../../../types';

type Args = {|
  // the current center position of the draggable
  pageBorderBoxCenter: Position,
  // the draggable that is dragging and needs to move
  draggable: DraggableDimension,
  // what the draggable is moving towards
  // can be null if the destination is empty
  target: ?DraggableDimension,
  // the droppable the draggable is moving to
  destination: DroppableDimension,
  // all the draggables inside the destination
  insideDestination: DraggableDimension[],
  // the source location of the draggable
  home: DraggableLocation,
  // the impact of a previous drag,
  previousImpact: DragImpact,
  // the viewport
  viewport: Viewport,
|}

export default ({
  pageBorderBoxCenter,
  destination,
  draggable,
  target,
  home,
  insideDestination,
  previousImpact,
  viewport,
}: Args): ?Result => {
  const amount: Position = patch(
    destination.axis.line,
    draggable.client.marginBox[destination.axis.size]
  );

  // moving back to the home list
  if (destination.descriptor.id === draggable.descriptor.droppableId) {
    return toHomeList({
      amount,
      originalIndex: home.index,
      target,
      insideDroppable: insideDestination,
      draggable,
      droppable: destination,
      previousImpact,
      viewport,
    });
  }

  // moving to a foreign list
  return toForeignList({
    amount,
    pageBorderBoxCenter,
    target,
    insideDroppable: insideDestination,
    draggable,
    droppable: destination,
    previousImpact,
    viewport,
  });
};
