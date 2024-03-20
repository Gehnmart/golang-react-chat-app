import React, { Component } from 'react';
import axios from 'axios';

import SocketConnection from '../../socket-connection';
import './Chat.css';

import {
  Container,
  Flex,
  Textarea,
  Box,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  Input,
} from '@chakra-ui/react';

import ChatHistory from './ChatHistory';
import ContactList from './ContactList';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socketConn: '',
      username: '',
      message: '',
      to: '',
      isInvalid: false,
      endpoint: 'http://localhost:8080',
      contact: '',
      contacts: [],
      renderContactList: [],
      chats: [],
      chatHistory: [],
      msgs: [],
    };
  }

  componentDidMount = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const user = queryParams.get('u');
    this.setState({ username: user });
    this.getContacts(user);

    const conn = new SocketConnection();
    await this.setState({ socketConn: conn });
    // conn.connect(msg => console.log('message received'));
    // connect to ws connection
    this.state.socketConn.connect(message => {
      const msg = JSON.parse(message.data);

      // update UI only when message is between from and to
      if (this.state.to === msg.from || this.state.username === msg.from) {
        this.setState(
          {
            chats: [...this.state.chats, msg],
          },
          () => {
            this.renderChatHistory(this.state.username, this.state.chats);
          }
        );
      }
    });

    this.state.socketConn.connected(user);

    console.log('exiting');
  };

  // on change of input, set the value to the message state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = e => {
    if (this.state.message.trim() === '') {
      return; // Ничего не делаем, если сообщение пустое или содержит только пробелы
    }
    if (e.type === 'submit' || e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
      const msg = {
        type: 'message',
        chat: {
          from: this.state.username,
          to: this.state.to,
          message: this.state.message,
        },
      };

      this.state.socketConn.sendMsg(msg);
      this.setState({ message: '' });
      // on error change isInvalid to true and message
    }
  };

  getContacts = async user => {
    const res = await axios.get(
      `${this.state.endpoint}/contact-list?username=${user}`
    );
    console.log(res.data);
    if (res.data['data'] !== undefined) {
      this.setState({ contacts: res.data.data });
      this.renderContactList(res.data.data);
    }
  };

  fetchChatHistory = async (u1 = 'user1', u2 = 'user2') => {
    const res = await axios.get(
      `http://localhost:8080/chat-history?u1=${u1}&u2=${u2}`
    );

    console.log(res.data, res.data.data.reverse());
    if (res.data.status && res.data['data'] !== undefined) {
      this.setState({ chats: res.data.data.reverse() });
      this.renderChatHistory(u1, res.data.data.reverse());
    } else {
      this.setState({ chatHistory: [] });
    }
  };

  addContact = async e => {
    e.preventDefault();
    if (this.state.contact.trim() === '') {
      this.setState({ isInvalid: true});
      return; // Ничего не делаем, если контакт пустой или содержит только пробелы
    }
    try {
      const res = await axios.post(`${this.state.endpoint}/verify-contact`, {
        username: this.state.contact,
      });

      console.log(res.data);
      
      if (!res.data.status) {
        this.setState({ isInvalid: true });
      } else {
        // Проверка, существует ли контакт уже в массиве
        const isContactExist = this.state.contacts.some(contact => contact.username === this.state.contact);
  
        if (!isContactExist) {
          // Контакт не существует, добавляем его
          let contacts = this.state.contacts;
          contacts.unshift({
            username: this.state.contact,
            last_activity: Date.now() / 1000,
          });
          this.renderContactList(contacts);
          this.setState({ isInvalid: false, contacts }); // Обновляем состояние с новым списком контактов
        } else {
          this.state.contacts.find(contact => contact.username === this.state.contact);
          this.setState({ isInvalid: true });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderChatHistory = (currentUser, chats) => {
    const history = ChatHistory(currentUser, chats);
    this.setState({ chatHistory: history });
  };

  renderContactList = contacts => {
    const renderContactList = ContactList(contacts, this.sendMessageTo);

    this.setState({ renderContactList });
  };

  sendMessageTo = to => {
    this.setState({ to });
    this.fetchChatHistory(this.state.username, to);
  };

  render() {
    return (
      <Container>
        <p style={{ textAlign: 'right', paddingBottom: '10px' }}>
          {this.state.username}
        </p>
        <Container paddingBottom={2}>
          <Box>
            <FormControl isInvalid={this.state.isInvalid}>
              <InputGroup size="md">
                <Input
                  variant="flushed"
                  type="text"
                  placeholder="Добавить контакт"
                  name="contact"
                  value={this.state.contact}
                  onChange={this.onChange}
                />
                <InputRightElement width="6rem">
                  <Button
                    colorScheme={'teal'}
                    h="2rem"
                    size="lg"
                    variant="solid"
                    type="submit"
                    onClick={this.addContact}
                  >
                    Добавить
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!this.state.isContactInvalid ? (
                ''
              ) : (
                <FormErrorMessage>Контакт с таким именем не найден</FormErrorMessage>
              )}
            </FormControl>
          </Box>
        </Container>
        <Flex
          borderWidth={1}
          borderRadius={'10px'}>
          <Box
            textAlign={'left'}
            overflowY={'scroll'}
            borderRightWidth={'1px'}
            flex="1"
            h={'32rem'}
          >
            {this.state.renderContactList}
          </Box>

          <Box flex="2">
            <Container
              borderRadius={'xl'}
              textAlign={'right'}
              h={'25rem'}
              padding={2}
              overflowY={'scroll'}
              display="flex"
              flexDirection={'column-reverse'}
            >
              {this.state.chatHistory}
            </Container>

            <Box flex="1">
              <FormControl onKeyDown={this.onSubmit} onSubmit={this.onSubmit}>
                <Textarea
                  type="submit"
                  borderRadius={'0px 0px 10px 0px'}
                  borderWidth={'1px 0px 0px 0px'}
                  minH={'7rem'}
                  placeholder="Начните писать... Нажмите Ввод для отправки сообщения!"
                  size="lg"
                  resize={'none'}
                  name="message"
                  value={this.state.message}
                  onChange={this.onChange}
                  isDisabled={this.state.to === ''}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Chat;

// Модель пользователя (User):
// Ключ (Key): Имя пользователя (username)
// Значение (Value): Пароль пользователя (password)

// Множество пользователей (User Set):
// Ключ (Key): Название множества пользователей (например, "users")
// Значения (Values): Имена зарегистрированных пользователей

// Список контактов (Contact List):
// Ключ (Key): Имя пользователя, к которому относится список контактов
// Значения (Values): Список контактов пользователя с временными метками (timestamp), обозначающими время последнего контакта

// Чаты (Chats):
// Ключ (Key): Уникальный идентификатор чата (например, "chat#<timestamp>")
// Значение (Value): JSON-объект, содержащий информацию о чате, такую как отправитель, получатель и текст сообщения

// Индекс для полнотекстового поиска (Full-Text Search Index):
// Индекс, созданный с использованием функции поиска Redis (FT.SEARCH), используемый для быстрого поиска чатов по отправителю, получателю и временным меткам.