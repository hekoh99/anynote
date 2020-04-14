exports.css = `h2, h1, p, nav{
  text-align: center;
  margin : 20px;
}
ul li{
  margin-bottom : 10px;
}
nav {
  border-top: 2px solid red;
  border-bottom: 2px solid red;
  padding : 20px;
}
nav li{
  list-style:none;
}
nav a {
  margin-left: 80px;
  margin-right: 80px;
  text-decoration: none;
}
a:visited {
  text-decoration: none;
  color : inherit;
}
a:hover {
  color : red;
}
a {
  text-decoration: none;
  padding : 10px;
  color : black;
}

h1 {
  border-bottom: solid red 2px;
  margin-top: 20px;
  padding-bottom: 30px;
  padding-top: 30px;
  color: red;
  margin-bottom: 0;
}
ul {
  margin-left: 20px;
  margin-right: 10px;
  width: 150px;
  padding-right : 0;
  text-align: left;
  border-right: 2px red solid;
  height: 100%;
}
#create {
  text-align:right;
  margin-right:50px;
}
p a {
  border : solid red 1px;
}
#grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
#layer{
  display:grid;
  grid-template-columns: 1fr 5fr;
}
input {
  width:300px;
  height:30px;
}
textarea {
  width:500px;
  height:200px;
  font-size:20px;
}
.simple {
  width:80px;
}
form {
  display:inline;
}`
