"use client"

import React from 'react';
import { useTimer } from 'react-timer-hook';
import navigate from '../_actions/navigate';
import emptyIq from '../_actions/emptyIq';

export default function Timer({ expiryTimestamp }: { expiryTimestamp: Date }) {
    const {
        seconds,
        minutes,
    } = useTimer({ 
        expiryTimestamp,
        onExpire: async () => {
            await emptyIq()
            await navigate("/results")
        }
    })

  return (
    <div className="text-center">      
      <div>
        <span>Time left: </span>
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}