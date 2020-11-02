import React, { useContext } from 'react';

export type ErrorHandler = (error: Error) => void;

const ErrorHandlerContext = React.createContext<ErrorHandler>(console.error);

export function useErrorHandler(): ErrorHandler {
  return useContext(ErrorHandlerContext);
}
