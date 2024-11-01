class Item {
  constructor(id = 0, nom = "", prix = 0.0)
  {
    this.init(id, nom, prix);
  }

  init(id = 0, nom = "", prix = 0.0)
  {
    var date = new Date();
    this.id = id;
    this.dateCreation = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    this.nom = nom;
    this.prix = prix;
  }
}

class ItemList
{
  constructor()
  {
    this.tab = [];
  }

  add(item)
  {
    if(this.tab[0] === undefined)
        item.id = 0;
    else
      item.id = this.tab[this.tab.length-1].id+1;

    this.tab.push(item);
  }

  removeItemById(id)
  {
    for(var i = 0; i < this.tab.length; ++i)
    {
      if(this.tab[i].id == id)
      {
        this.tab.splice(i,1);
        return 1;
      }
    }
    return 0;
  }

  removeItemByName(nom)
  {
    for(var i = 0; i < this.tab.length; ++i)
    {
      console.log("nom: "+this.tab[i].nom+" : "+nom);
      if(this.tab[i].nom == nom)
      {
        this.tab.splice(i,1);
        return 1;
      }
    }
    return 0;
  }

  getLastItemId()
  {
    return this.tab[this.tab.length-1].id;
  }

  getLength()
  {
    return this.tab.length;
  }

/*
//Debug terminer, au début les données dans tab ne s'affichait pas et me
//proposait plutôt de voir mon code de la définition de la méthode.
  getTab()
  {
    return this.tab;
  }
*/
}
//-==========================================-
//-==========================================-

//console.log("hello world!");

var itemList = new ItemList();

itemList.add(new Item(5,"a",5));
itemList.add(new Item(6,"b",10));
itemList.add(new Item(7,"c",15));
itemList.removeItemById(1);
//console.log(itemList);
itemList.add(new Item(8,"d",20));
//console.log(itemList);
itemList.removeItemByName("a");
//console.log(itemList);

module.exports.itemList=itemList;
module.exports.Item=Item;

//Résultat atelier avant bonus
/*
hello world!
ItemList {
  tab:
   [ Item { id: 0, dateCreation: '3/10/2019', nom: 'a', prix: 5 },
     Item { id: 2, dateCreation: '3/10/2019', nom: 'c', prix: 15 } ] }
ItemList {
  tab:
   [ Item { id: 0, dateCreation: '3/10/2019', nom: 'a', prix: 5 },
     Item { id: 2, dateCreation: '3/10/2019', nom: 'c', prix: 15 },
     Item { id: 3, dateCreation: '3/10/2019', nom: 'd', prix: 20 } ] }
nom: a : a
ItemList {
  tab:
   [ Item { id: 2, dateCreation: '3/10/2019', nom: 'c', prix: 15 },
     Item { id: 3, dateCreation: '3/10/2019', nom: 'd', prix: 20 } ] }
*/
