# Usa una imagen base de Node.js
FROM node:18.17

# Crea y establece el directorio de trabajo en el contenedor
WORKDIR /app

# Define los argumentos de construcción
ARG REACT_APP_SQL_USER
ARG REACT_APP_SQL_PASSWORD
ARG REACT_APP_SQL_DB
ARG REACT_APP_SQL_HOST
ARG REACT_APP_SQL_PORT
ARG PORT
ARG TZ

# Establece las variables de entorno usando los argumentos de construcción
ENV REACT_APP_SQL_USER=$REACT_APP_SQL_USER
ENV REACT_APP_SQL_PASSWORD=$REACT_APP_SQL_PASSWORD
ENV REACT_APP_SQL_DB=$REACT_APP_SQL_DB
ENV REACT_APP_SQL_HOST=$REACT_APP_SQL_HOST
ENV REACT_APP_SQL_PORT=$REACT_APP_SQL_PORT
ENV PORT=$PORT
ENV TZ=$TZ

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]
