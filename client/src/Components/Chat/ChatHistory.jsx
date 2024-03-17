import React from 'react';
import { Text, Box, Container } from '@chakra-ui/react';
import { formatDistanceToNow, format, isYesterday, isToday } from 'date-fns';
import ruLocale from 'date-fns/locale/ru'; // Локализация на русский язык

const ChatHistory = (currentUser, chats) => {
  const history = chats.map(m => {
    // incoming message on left side
    let margin = '0%';
    let bgcolor = 'darkgray';
    let textAlign = 'left';
    let borderRadius = '20px 20px 20px 0px';

    if (m.from === currentUser) {
      // outgoing message to right
      margin = '20%';
      bgcolor = 'teal.400';
      textAlign = 'right';
      borderRadius = '20px 20px 0px 20px';
    }

    const ts = new Date(m.timestamp * 1000);

    // Форматирование даты и времени
    let formattedTime = format(ts, 'HH:mm', { locale: ruLocale }); // Формат времени (часы и минуты)
    if (isYesterday(ts)) {
      formattedTime = 'вчера';
    } else if (isToday(ts)) {
      formattedTime = formatDistanceToNow(ts, { locale: ruLocale, addSuffix: true }); // Сокращенный формат (например, "1 минуту назад")
    } else {
      formattedTime = format(ts, 'd MMMM yyyy', { locale: ruLocale }); // Формат даты (день, месяц, год)
    }

    return (
      <Box
        key={m.id}
        textAlign={textAlign}
        width={'auto'} // Установка ширины на автоматический размер
        p={2}
        marginTop={2}
        marginBottom={2}
        marginLeft={margin}
        paddingRight={2}
        bg={bgcolor}
        borderRadius={borderRadius}
      >
        <Text
        wordBreak={'break-word'}> {m.message} </Text>
        <Text as={'sub'} fontSize="xs">
          {' '}
          {formattedTime}{' '}
        </Text>
      </Box>
    );
  });

  return <Container>{history}</Container>;
};

export default ChatHistory;
