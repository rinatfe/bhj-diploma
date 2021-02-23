/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */
  static URL =  '/account'
  static get(iden = '', callback){
     let data = {}
     data.id = iden
    createRequest({method: 'GET', url: this.URL, callback, responseType: 'json', data })
  }
}
