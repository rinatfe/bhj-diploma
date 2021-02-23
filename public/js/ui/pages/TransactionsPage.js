/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element || element == '')
      throw "Переданный элемент не существует";
    this.element = element; 
    this.registerEvents() 
  }
  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if(this.render.lastOptions)
      this.render(this.render.lastOptions)
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    let that = this
    let removeBills = document.querySelector('.remove-account')
    
    removeBills.addEventListener('click', ()=> {
      this.removeAccount()
    })
    if(App.state === "user-logged" && document.querySelector('.transaction__remove')) {
      let removeTransaction = document.querySelector('.transaction__remove')
      removeTransaction.addEventListener('click', ()=> {
        this.removeTransaction(that.element.data.id)
      })
    }  
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if(this.render.lastOptions) {
      alert('Вы действительно хотите удалить счёт?')
      Account.remove(this.render.lastOptions, (err, response)=> {
        if(response.success == true) {
          App.update()
        }
      })
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    
    Transaction.remove(id, (err, response)=> {
      alert('Вы действительно хотите удалить эту транзакцию?')
      if(response.success) {
        App.update()
      }
    })
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options){
      this.lastOptions = options.account_id
      Account.get(this.lastOptions, (err, response)=> {
        if(response.success == true) {
          this.renderTitle(response.data[response.data.findIndex(item => item.id == this.lastOptions)].name)
        }
      
      Transaction.list(response.data[response.data.findIndex(item => item.id == this.lastOptions)], (err, response2)=> {
        this.renderTransactions(response2.data)
      })
    })
    } else {
      return
    }

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([])
    this.renderTitle('Название счета')
    this.render.lastOptions = ''
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').innerText = name
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
      let time = new Date(date)
      let year = time.getFullYear(); 
      let month = time.getMonth();
      let day = time.getDate(); 
      let hour = time.getHours(); 
      let minutes = time.getMinutes(); 
      let seconds = time.getSeconds(); 
      function convert(data) {
        if(data < 10)
          return '0' + data
        return data 
      }
      let months = ['Января', "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
      return `${day}` + ' ' + `${months[month]}` + ' ' + `${year}` + ' .г' + ' в ' + `${convert(hour)}` + ':' + `${convert(minutes)}` + ':' + `${convert(seconds)}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let type = item.type
    return `<div class="transaction transaction_${type.toLowerCase()} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item["created_at"])}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    let content = document.querySelector('.content')
    for(let i in data) {
      content.insertAdjacentHTML("afterbegin", this.getTransactionHTML(data[i])) 
    }
  }
}