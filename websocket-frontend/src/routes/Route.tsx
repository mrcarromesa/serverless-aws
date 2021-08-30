import React from 'react';
import { Route as ReactDOMRoute, RouteProps as ReactDOMRouteProps } from 'react-router-dom';

interface IRouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<IRouteProps> = ({
  component: Component, ...rest
}) => (
  <ReactDOMRoute
    {...rest}
    render={() => (
      <>
        <Component />
      </>
    )}
  />
);

export default Route;
