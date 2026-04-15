import React from 'react';
import { TIANCHI_BOARD_TOPOLOGY } from '../data/tianchiBoardTopology';
import { BoardTopologyCards } from './BoardTopologyCards';

export function TianChiBoardTopologyView() {
  return <BoardTopologyCards model={TIANCHI_BOARD_TOPOLOGY} />;
}
