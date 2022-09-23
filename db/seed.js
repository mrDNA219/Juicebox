const {client, getAllUsers, createUser, updateUser, createPost, updatePost, getAllPosts, getPostsByUser} = require('./index')
async function testDB() {
    try {
      console.log("Starting to test database...");
  
      const users = await getAllUsers();
      console.log("result:", users);
      console.log('calling updateUsers on users[0]')
      const updateUserResult = await updateUser(users[0].id, {
          name: 'newname sogood',
          location: 'Lesterville, KY'
      });
      console.log('updateUserResult:', updateUserResult);
      console.log('starting to get all posts');
      const posts = await getAllPosts();
      console.log('result:', posts);
      console.log('calling update post function');
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "This is the new, updated content"
      });
      console.log("Result:", updatePostResult);
      console.log("Calling getUserById")
      const getSingleUser = await getPostsByUser(1);
      console.log('Result:', getSingleUser)
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
  
async function dropTables() {
    try{
        console.log('starting to drop tables...')
        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
        console.log('finished dropping tables!')
    } catch(error){
        console.error('error dropping tables!')
        throw error
    }
}
async function createTables() {
    try{
        console.log('starting to build tables')
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(225) NOT NULL,
            location VARCHAR(225) NOT NULL,
            active BOOLEAN DEFAULT true
          );
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id) NOT NULL,
          title varchar(225) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        );
        `);
        console.log('finished building tables!')
    } catch (error){
        console.error('error building tables!')
        throw error
    }
}
async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'albert', location: 'alberta' });
      const sandra = await createUser({username: 'sandra', password: '2sandy4me', name: 'sandra', location: 'the beach' });
      const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'gloria', location: 'graceland'});
      
      console.log(albert, sandra, glamgal)
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  async function createInitialPosts() {
    try{
      const [albert, sandra, glamgal] = await getAllUsers();
      await createPost({
        authorId: albert.id,
        title: "My first post",
        content: "This is just testing my first post",
        active: true
      });

    } catch(error) {
      throw error
    }
  }
async function rebuildDB() {
    try{
        await client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error){
        console.error(error);
    }
}
rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());