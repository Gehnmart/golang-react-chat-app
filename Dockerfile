# Используем базовый образ для Go
FROM golang:latest AS builder

# Устанавливаем рабочую директорию для сервера Go
WORKDIR /app

# Копируем файлы go.mod и go.sum и загружаем зависимости
COPY go.mod .
COPY go.sum .
RUN go mod download

# Копируем все файлы проекта
COPY . .

# Собираем проект
RUN go build -o gochatapp