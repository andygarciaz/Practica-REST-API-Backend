import {getConnection, sql} from "../utils/db.js"

export const login = async (req, res) => {
    const { username, password } = req.body
    const pool = await getConnection()
    const result = await pool.request()
        .input("username", sql.VarChar, username)
        .query("SELECT * FROM Users WHERE username=@username")
    const user = result.recordset[0]
    if(user.password === password){
        res.status(200).json({login:true, user:user})
    }else{
        res.status(401).json({login:false, user:{}})
    }
    
}
