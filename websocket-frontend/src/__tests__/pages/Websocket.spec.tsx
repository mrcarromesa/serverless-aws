import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import WS from 'jest-websocket-mock';
import Websocket from '~/pages/Websocket';

let server: WS;

describe('Testing Jest Websocket Mock', () => {
  beforeEach(async () => {
    server = new WS(String(process.env.REACT_APP_WEBSOCKET_URL));
  });

  afterEach(() => {
    WS.clean();
  });

  it('should be add name from user to top bar when field name is filled', async () => {
    const { getByTestId } = render(<Websocket />);
    const buttonOkModal = getByTestId('websocket-button-modal-ok');
    const contentInputModalName = getByTestId('websocket-modal-input-name');
    const inputModalName = contentInputModalName.getElementsByTagName('input');
    fireEvent.change(inputModalName[0], { target: { value: 'User1' } });

    fireEvent.click(buttonOkModal);

    await waitFor(() => {
      expect(getByTestId('websocket-title-name').innerHTML).toEqual('Olá User1');
    });

    await server.connected;
    await expect(server).toReceiveMessage(expect.stringContaining('User1'));
  });

  it('should be add name Anonymous from user to top bar when field name is not filled', async () => {
    const { getByTestId } = render(<Websocket />);
    const buttonOkModal = getByTestId('websocket-button-modal-ok');
    const contentInputModalName = getByTestId('websocket-modal-input-name');
    const inputModalName = contentInputModalName.getElementsByTagName('input');
    fireEvent.change(inputModalName[0], { target: { value: '' } });

    fireEvent.click(buttonOkModal);

    await waitFor(() => {
      expect(getByTestId('websocket-title-name').innerHTML).toEqual('Olá Anonymous');
    });

    await server.connected;
    await expect(server).toReceiveMessage(expect.stringContaining('Anonymous'));
  });

  it('should be add name Anonymous from user to top bar when cancel modal', async () => {
    const { getByTestId } = render(<Websocket />);
    const buttonCancelModal = getByTestId('websocket-button-modal-cancel');

    fireEvent.click(buttonCancelModal);

    await waitFor(() => {
      expect(getByTestId('websocket-title-name').innerHTML).toEqual('Olá Anonymous');
    });

    await server.connected;
    await expect(server).toReceiveMessage(expect.stringContaining('Anonymous'));
  });

  it('should be add msg to chat when receive msg', async () => {
    const { getByTestId, queryAllByTestId } = render(<Websocket />);
    const buttonCancelModal = getByTestId('websocket-button-modal-cancel');

    fireEvent.click(buttonCancelModal);
    await waitFor(async () => {
      const itemChatBeforeReceiveMessage = queryAllByTestId('websocket-item-chat');
      expect(itemChatBeforeReceiveMessage.length).toEqual(0);
      await server.connected;
    });

    await expect(server).toReceiveMessage(expect.stringContaining('Anonymous'));
    server.send(JSON.stringify({ action: 'sendMessage', data: { msg: 'Oi', type: 'msg', name: 'User2' } }));
    await waitFor(() => {
      const itemChat = queryAllByTestId('websocket-item-chat');
      expect(itemChat.length).toEqual(1);
    });
  });

  it('should be show typing indicator when has a user typing', async () => {
    const { getByTestId, queryAllByTestId } = render(<Websocket />);
    const buttonCancelModal = getByTestId('websocket-button-modal-cancel');

    fireEvent.click(buttonCancelModal);
    await waitFor(async () => {
      await server.connected;
      await expect(server).toReceiveMessage(expect.stringContaining('Anonymous'));
      server.send(JSON.stringify({ msg: '', type: 'typing', name: 'User2' }));
    });
    await waitFor(() => {
      const itemChat = queryAllByTestId('websocket-typing');
      expect(itemChat.length).toEqual(1);
    });
    server.send(JSON.stringify({ msg: '', type: 'end-typing', name: 'User2' }));
    await waitFor(() => {
      const itemChat = queryAllByTestId('websocket-typing');
      expect(itemChat.length).toEqual(0);
    });
  });

  it('should be coverage onClose websocket', async () => {
    const { getByTestId } = render(<Websocket />);
    const buttonCancelModal = getByTestId('websocket-button-modal-cancel');

    fireEvent.click(buttonCancelModal);
    await waitFor(async () => {
      await server.connected;
      await expect(server).toReceiveMessage(expect.stringContaining('Anonymous'));
      server.close();
    });
  });

  it('should be coverage onClose websocket when has error', async () => {
    const { getByTestId } = render(<Websocket />);
    const buttonCancelModal = getByTestId('websocket-button-modal-cancel');

    fireEvent.click(buttonCancelModal);

    await server.connected;
    await waitFor(async () => {
      await expect(server).toReceiveMessage(expect.stringContaining('Anonymous'));
      server.error();
    });
  });
});
