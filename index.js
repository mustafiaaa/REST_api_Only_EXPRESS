express =  require("express")
db = require('./db/db')
bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
     res.send("I am no one")
});

//creating base rout
app.get('/', (req, res) => {
    res.status(200).send({
        success : 'true',
        message : 'Welcome to Todo RestAPI'
    })
})

//API for get all the records from the db
app.get('/api/v1/todos', (req, res) => {
    res.status(200).send({
        success : 'true',
        message : 'todos retrived sucessfully',
        todos: db 
    })
});

//API for get any particualr record from the db
app.get('/api/v1/todos/:id', (req, res) => {
    console.log(req)
    let todoId = parseInt(req.params.id, 10);
    
    db.map((todo) => {
        if(todo.id == todoId){
            return res.status(200).send({
                   success : 'true',
                   message : 'todo found successfully',
                   todo
                 })
        }
    })
    return res.status(404).send({
        success : 'false',
        message : 'todo does not exist'
    })
})

//endpoint to create a todo
app.post('/api/v1/createTodo', (req, res)=> {
    console.log(req.body)
    if(!req.body.title){
        return res.status(400).send({
            success : 'false',
            message : 'Title is not present in post'
        })
    }
    
    else if(!req.body.description){
        return res.status(400).send({
            success: 'false',
            message : 'Description is mendetory'
        })
    }

    const todo = {
        id: db.length+1,
        title: req.body.title,
        description : req.body.description
    }

    db.push(todo)
    return res.status(200).send({
        success : 'true',
        message : 'Todo successfully added',
        todo
    })
})

//endpoint to delete a todo

app.delete('/api/v1/delete/:id', (req, res) => {
    let todoId = parseInt(req.params.id, 10)
    db.map((todo, index) => {
        if(todo.id === todoId) {
            db.splice(index, 1)
            return res.status(200).send({
                success: 'true',
                message : `id = ${todoId} todo is deleted successfully !!!`
            })
        }

    })
    return res.status(404).send({
        success: 'false',
        message : `id = ${todoId} todo is not exist !!!`
    })
})

//endpoint to update a todo
app.put('/api/v1/update/:id', (req, res) => {
    let id = parseInt(req.params.id, 10)
    let todoFound
    let itemIndex
    db.map((todo, index) => {
        if(todo.id === id){
            todoFound = todo
            itemIndex = index
        }
    })

    if(!todoFound){
        return res.status(400).send({
            success : 'false',
            message : 'Todo not exist'
        })
    }

    if(!req.body.title){
        return res.status(400).send({
            success: 'false',
            message : 'Title is required !!!'
        })
    } 
    else if(!req.body.description){
        return res.status(400).send({
            success: 'false',
            message : 'Description is required'
        })
    }

    const newTodo = {
        id : todoFound.id,
        title : req.body.title,
        description : req.body.description  
    }

    db.splice(itemIndex, 1, newTodo)

    return res.status(200).send({
        success: 'true',
        description : 'Todo successfully updated !!!'
    })
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is running on PORT :  ${PORT}`)
})