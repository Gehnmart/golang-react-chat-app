import React, { Component } from 'react';
import axios from 'axios';

import {
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Input,
  Stack,
  Button,
} from '@chakra-ui/react';

import { EditIcon } from '@chakra-ui/icons';
import { Navigate } from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
      isInvalidUsername: '',
      isInvalidPassword: '',
      endpoint: 'http://localhost:8080/register',
      redirect: false,
      redirectTo: '/chat?u=',
    };
  }

  // on change of input, set the value to the message state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ message: '', isInvalidUsername: false, isInvalidPassword: false });

    if (this.state.username === '') {
      this.setState({ message: 'Имя пользователя не может быть пустым', isInvalidUsername: true });
      return;
    }
    if (this.state.password === '') {
      this.setState({ message: 'Пароль не может быть пустым', isInvalidPassword: true });
      return;
    }
    if (this.state.username.length < 6) {
      this.setState({ message: 'Имя пользователя должно содержать не менее 6 символов', isInvalidUsername: true });
      return;
    }
    if (this.state.password.length < 6) {
      this.setState({ message: 'Пароль должен содержать не менее 6 символов', isInvalidPassword: true });
      return;
    }
    
    try {
      const res = await axios.post(this.state.endpoint, {
        username: this.state.username,
        password: this.state.password,
      });

      console.log('register', res);
      if (res.data.status) {
        const redirectTo = this.state.redirectTo + this.state.username;
        this.setState({ redirect: true, redirectTo });
      } else {
        // on failed
        this.setState({ message: "Неверное имя пользователя или такое имя уже существует", isInvalidUsername: true });
      }
    } catch (error) {
      console.log(error);
      this.setState({ message: 'Внутренняя ошибка', isInvalidUsername: true });
    }
  };

  render() {
    return (
      <div>
        {this.state.redirect && (
          <Navigate to={this.state.redirectTo} replace={true}></Navigate>
        )}

        <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
          <Box borderRadius="lg" padding={10} borderWidth="2px">
            <Stack spacing={5}>
              <FormControl isInvalid={this.state.isInvalidUsername}
              _valid={{borderColor: 'green.300'}
              }>
                <FormLabel>Имя пользователя</FormLabel>
                <Input
                  type="text"
                  placeholder="Имя Пользователя"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                />

                {!this.state.isInvalidUsername ? (
                  <></>
                ) : (
                  <FormErrorMessage>{this.state.message}</FormErrorMessage>
                )}
                {/* <FormHelperText>use a unique username</FormHelperText> */}
              </FormControl>
              <FormControl isInvalid={this.state.isInvalidPassword}>
                <FormLabel>Пароль</FormLabel>
                <Input
                  type="password"
                  placeholder="Пароль"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                {!this.state.isInvalidPassword ? (
                  <></>
                ) : (
                  <FormErrorMessage>{this.state.message}</FormErrorMessage>
                )}
                <FormHelperText></FormHelperText>
              </FormControl>
              <Button
                size="lg"
                leftIcon={<EditIcon />}
                colorScheme="green"
                variant="solid"
                type="submit"
                onClick={this.onSubmit}
              >
                Регистрация
              </Button>
            </Stack>
          </Box>
        </Container>
      </div>
    );
  }
}

export default Register;
