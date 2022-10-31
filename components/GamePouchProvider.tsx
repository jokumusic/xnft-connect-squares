import React, {createContext, useCallback, useEffect, useRef, useState} from 'react';

export const GamePouchContext = createContext({});

export function GamePouchProvider(props) {
    return (
        <GamePouchContext.Provider value={{}}>

        {props.children}
        </GamePouchContext.Provider>
    );
}