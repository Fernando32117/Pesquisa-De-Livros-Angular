import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Remove logs no console
  }
);


sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado ao banco de dados!"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco:", err));


// ✅ Sincronizar banco automaticamente
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Banco de dados sincronizado!"))
  .catch((err) => console.error("❌ Erro ao sincronizar o banco:", err));
console.log("Banco de dados:", process.env.DB_NAME);
console.log("Usuário:", process.env.DB_USER);
console.log("Host:", process.env.DB_HOST);


export default sequelize;
