import styled, { css } from 'styled-components';

import {
  ButtonBase as ButtonBaseMaterial,
  Grid,
  Toolbar,
} from '@material-ui/core';

export const ListConversation = styled(Grid)`
  flex: 1;
  max-height: 100vh;
  overflow-y: scroll;
  box-shadow: 0px 0px 2px #000;
`;

export const SideConversation = styled(Grid)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const TopBarSideConversation = styled(Toolbar)`
  background: #1976d2;
  color: #fff;
`;

export const ButtonBase = styled(ButtonBaseMaterial)`
  padding: 0.5rem;
  width: 100%;
`;

export const AvatarImage = styled.div`
  border-radius: 50%;
  height: 75px;
  width: 75px;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2rem;
`;

export const ContainerConveration = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ContentConveration = styled.div`
  padding-top: 1.5rem;
  flex-direction: column;
  display: flex;
  width: 100%;
  max-height: calc(100vh - 170px);
  min-height: calc(100vh - 170px);
  flex: 1;
  overflow-y: scroll;
  background: #e8e8e8;
`;

interface IItemChatProps {
  msgFromMy: boolean;
}

export const ItemChat = styled.p<IItemChatProps>`
  ${(props) => (props.msgFromMy ? css`
    background: #435f7a;
    color: #fff;
    align-self: flex-end;
    margin-right: 1.5rem;
  ` : css`
    background: #f5f5f5;
    color: #000;
    margin-left: 1.5rem;
  `)}

  margin-bottom: 2rem;
  padding: 1.5rem;
  position: relative;
  width: 90%;
  min-height: 4rem;
  border-radius: 10px;


  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    z-index: 1;
    border-style: solid;
    bottom: 7px;
    ${(props) => (props.msgFromMy ? css`
      border-width: 1rem 0 0 1rem;
      border-color: transparent transparent transparent #435f7a;
      right: -14px;
  ` : css`
      border-width: 0 0 1rem 1rem;
      border-color: transparent transparent #f5f5f5 transparent;
      left: -14px;
  `)}
    margin-top: -10px;
  }

  span {
    color: #9e9e9e;
    font-size: 1rem;
    position: absolute;
    top: 0.2rem;
  }
`;
