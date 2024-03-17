import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import { EditIcon, ArrowForwardIcon } from '@chakra-ui/icons';

function Landing() {
  return (
    <Container maxW="2xl" marginTop="3rem" centerContent>
      <Box padding="5" marginBlockEnd={5}>
        <Text fontSize="3xl" paddingBlockEnd={5}>
          Простой чат который использует компоненты Chakra UI
        </Text>
      </Box>
      <Box>
        <Stack direction="row" spacing={7}>
          <Link to="register">
            <Button
              size="lg"
              leftIcon={<EditIcon />}
              colorScheme="green"
              variant="solid"
            >
              Регистрация
            </Button>
          </Link>
          <Link to="login">
            <Button
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              colorScheme="green"
              variant="outline"
            >
              Вход
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}

export default Landing;
