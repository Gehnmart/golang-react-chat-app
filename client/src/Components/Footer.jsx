import React from 'react';

import { Box, Heading, Center } from '@chakra-ui/react';

function Footer() {
  return (
    <Box padding={8}>
      <Center>
        <Heading size="sm">Создано на Redis и Golang</Heading>
      </Center>
      <Center>
        <Heading fontStyle={'italic'} size="sm" paddingTop={2}>
        </Heading>
      </Center>
    </Box>
  );
}

export default Footer;
