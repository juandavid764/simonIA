export class Node {
  constructor({ title, link, icon = null }) {
    this.title = title;
    this.link = link;
    this.icon = icon;
    this.hijos = [];
    this.component = () => {
      return (
        <div>
          <strong>{this.link}</strong>
          <h1>{this.title}</h1>
        </div>
      );
    };
  }

  agregarHijo(nodo) {
    this.hijos.push(nodo);
  }
}