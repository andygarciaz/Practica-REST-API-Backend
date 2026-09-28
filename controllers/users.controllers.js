import { getConnection, sql} from "../utils/db.js"

export const getUsers = async (req,res) => {
    const pool = await getConnection()
    const result = await pool.request().query("select * from users")
    res.json(result.recordset)
}
export const getUser = async (req,res) => {
    const pool = await getConnection()
    const result = await pool.request().input("id", sql.Int, req.params.id).query("select * from users where id=@id")
    res.json(result.recordset[0])
}
export const postUser = async (req,res) => {
    const {name, age, points, username, password} = req.body
    const pool = await getConnection()
    const result = await pool.request()
        .input("name", sql.VarChar, name)
        .input("age", sql.Int, age)
        .input("points", sql.Int, points)
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query("insert into users (name, age, points, username, password) values (@name, @age, @points, @username, @password)")
    res.json(result)
}
export const putUser = async (req,res) => {
    const {name, age, points, username, password} = req.body
    const pool = await getConnection()
    const result = await pool.request()
        .input("id", sql.Int, req.params.id)
        .input("name", sql.VarChar, name)
        .input("age", sql.Int, age)
        .input("points", sql.Int, points)
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query("UPDATE users SET name=@name, age=@age, points=@points, username=@username, password=@password WHERE id=@id")
    res.json(result)
}

export const deleteUser = async (req, res) => {
    const id = req.params.id
    const pool = await getConnection()
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM users WHERE id = @id")
    res.json(result)
}
    