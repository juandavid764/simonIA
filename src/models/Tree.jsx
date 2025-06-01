import { Node } from "./Node.jsx";

const data = {
  Profile: [],
  Messages: [],
  Settings: [
    { Account: [] },
    { Profile: [] },
    { Password: [] },
    { Notification: [] },
  ],
  Help: [
    { FAQs: [] }, 
    { "Submit a Ticket": [] }, 
    { "Network status": [] },
  ],
  Logout: [],
};

// Crear el árbol
export const root = new Node({ title: "Root", link: "/" });

for (const [key, value] of Object.entries(data)) {
  //Se crea el nodo padre y se agrega a la raíz
  const node = new Node({ title: key, link: `/${key}` });
  root.agregarHijo(node);

  //Recorre los hijos del nodo
  for (const subValue of value) {
    const subNode = new Node({ title: Object.keys(subValue)[0], link: `/${key}/${Object.keys(subValue)[0]}` });
    node.agregarHijo(subNode);
  }
}

console.log(root); // Verifica la estructura del árbol en la consola
