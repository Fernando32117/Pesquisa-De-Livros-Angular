# Usando a imagem oficial do Node.js
FROM node:18

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json primeiro para aproveitar o cache do Docker
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copiar todos os arquivos restantes
COPY . . 

# Expor a porta 3000
EXPOSE 3000

# Comando para rodar o backend
CMD ["node", "server.js"]


