import React,
{
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Grid, Button, Typography, CssBaseline,
  TextField, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import { MdSend } from 'react-icons/md';
import {
  ItemChat,
  SideConversation,
  TopBarSideConversation,
  ContainerConveration,
  ContentConveration,
} from './styles';
import TypingBullet from '~/components/TypingBullet';

const URL = String(process.env.REACT_APP_WEBSOCKET_URL);

const { REACT_APP_TIME_TO_RECONNECT: time_reconnect } = process.env;

// mock websocket
// https://stackoverflow.com/questions/42867183/mocking-websocket-in-jest

interface IMsgs {
  from: string;
  name: string;
  msg: string;
}

interface IRemoteTyping {
  name: string;
  is_typing: boolean;
}

const WebsocketComponent: React.FC = () => {
  const ws = useRef<WebSocket | null>(new WebSocket(URL));
  const contentConversation = useRef<HTMLDivElement>(null);

  const timeIdle = useRef<number | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState<IRemoteTyping[]>([]);

  const [openModalUser, setOpenModalUser] = useState(true);

  const [name, setName] = useState('Anonymous');

  const [isConnected, setIsConnected] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textReceived, setTextReceived] = useState<IMsgs[]>([]);

  const conversationScrollToBottom = useCallback(() => {
    if (contentConversation.current) {
      contentConversation.current.scrollTop = contentConversation.current?.scrollHeight;
    }
  }, []);

  const usersTypings = useMemo(() => (remoteTyping.length > 0 ? remoteTyping.map((item) => item.name).join(', ') : ''), [remoteTyping]);

  useEffect(() => {
    if (textReceived.length > 0) {
      conversationScrollToBottom();
    }
  }, [textReceived, conversationScrollToBottom]);

  const handleCloseModalUser = useCallback(() => {
    setName('Anonymous');
    setOpenModalUser(false);
  }, []);

  const handleOkModalUser = useCallback(() => {
    if (name.trim().length === 0) {
      setName('Anonymous');
    }
    setOpenModalUser(false);
  }, [name]);

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setName(e.target.value);
    }, [],
  )

  // const connectWebsocket = useCallback(() => {

  // }, []);

  useEffect(() => {
    let isMounted = true;
    const connectWebsocket = (): void => {
      if (isMounted) {
        if (!ws.current) {
          ws.current = new WebSocket(URL);
        }

        ws.current.onopen = () => {
          setIsConnected(true);
        };

        ws.current.onclose = () => {
          setIsConnected(false);
          setTimeout(() => {
            ws.current = null;
            connectWebsocket();
          }, Number(time_reconnect));
        };

        ws.current.onerror = () => {
          ws.current?.close();
        };
      }
    };

    connectWebsocket();

    return () => {
      isMounted = false;
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    ws.current!.onmessage = (e) => {
      const { name: nameUser = '', msg = '', type = 'msg' } = JSON.parse(e.data) || { name: '', msg: '', type: 'msg' };

      if (type === 'msg') {
        setTextReceived((oldValue) => {
          const msgChat = {
            from: 'remote',
            name: nameUser,
            msg,
          };
          return [...oldValue, msgChat];
        });
      } else if (type === 'typing' || type === 'end-typing') {
        setRemoteTyping((oldValue) => {
          const parseValue = [...oldValue];
          const indexTyping = parseValue.findIndex((item) => item.name === nameUser);

          if (indexTyping >= 0) {
            parseValue[indexTyping].is_typing = type === 'typing';
          } else {
            parseValue.push({
              name: nameUser,
              is_typing: type === 'typing',
            });
          }

          return parseValue.filter((item) => item.is_typing);
        });
      }
    };
  }, []);

  useEffect(() => {
    const msg = { action: 'sendMessage', data: { msg: '', name, type: isTyping ? 'typing' : 'end-typing' } };

    if (isConnected && ws.current && name.trim().length > 0) {
      ws.current.send(JSON.stringify(msg));
    }
  }, [isTyping, name, isConnected]);

  const handleSendMsg = useCallback(() => {
    if (textInput.trim() !== '') {
      const msg = { action: 'sendMessage', data: { msg: textInput, name, type: 'msg' } };

      ws.current?.send(JSON.stringify(msg));
      setTextReceived((oldValue) => {
        const msgChat = {
          from: 'my',
          name,
          msg: textInput,
        } as IMsgs;
        return [...oldValue, msgChat];
      });
    }
    setTextInput('');
  }, [textInput, name]);

  const onKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSendMsg();
    } else {
      if (timeIdle.current) {
        clearTimeout(timeIdle.current);
      }
      setIsTyping(true);
      timeIdle.current = Number(setTimeout(() => {
        setIsTyping(false);
      }, 400));
    }
  }, [handleSendMsg]);

  return (
    <>
      <CssBaseline />
      <Grid container>

        <SideConversation item>
          <TopBarSideConversation>
            <Typography data-testid="websocket-title-name" variant="h6">
              Olá
              {' '}
              {name}
            </Typography>
          </TopBarSideConversation>

          <ContainerConveration>
            <ContentConveration
              ref={contentConversation}
            >
              {textReceived.map((item) => (
                <ItemChat data-testid="websocket-item-chat" msgFromMy={item.from === 'my'} key={`${Math.random()}${item.from}${item.msg}`}>
                  <span>{item.from === 'my' ? 'Você' : item.name}</span>
                  {item.msg}
                </ItemChat>
              ))}
            </ContentConveration>
            {
              usersTypings && (
              <Typography data-testid="websocket-typing" variant="body2">
                {usersTypings}
                <TypingBullet />
              </Typography>
              )
            }
            <Grid container>
              <Grid item xs={11}>
                <TextField
                  multiline
                  style={{
                    width: '100%',
                    marginLeft: '0.5rem',
                  }}
                  rows={3}
                  rowsMax={3}
                  label="Mensagem"
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                  }}
                  onKeyUp={onKeyUp}
                />
              </Grid>
              <Grid item>
                <Box alignItems="flex-end" display="flex">
                  <Button
                    color="primary"
                    onClick={handleSendMsg}
                  >
                    <MdSend size={30} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ContainerConveration>
        </SideConversation>
      </Grid>

      <Dialog open={openModalUser} onClose={handleCloseModalUser} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Entrar no Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Informe seu nome para continuar
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={name}
            onChange={handleChangeText}
            placeholder="Anonymous"
            label="Informe seu nome"
            type="text"
            fullWidth
            data-testid="websocket-modal-input-name"
          />
        </DialogContent>
        <DialogActions>
          <Button data-testid="websocket-button-modal-cancel" onClick={handleCloseModalUser} color="primary">
            Anonymous
          </Button>
          <Button data-testid="websocket-button-modal-ok" onClick={handleOkModalUser} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WebsocketComponent;
