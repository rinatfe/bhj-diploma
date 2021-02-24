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
    this.lastOptions 
    this.registerEvents() 
  }
  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if(this.lastOptions)
      this.render(this.lastOptions)
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
      event.preventDefault()
        this.removeAccount()
    })
     
    let content = document.querySelector('.content')
    content.addEventListener('click', (event)=>{
      let target = event.target;
      if(target.classList.contains('transaction__remove')){
        event.preventDefault()
        const id = {}
        id.id = target.dataset.id
        that.removeTransaction(id) 
      }else if(target.classList.contains('fa-trash')){
        event.preventDefault()
          const id = {}
          id.id = target.closest('button').dataset.id
          that.removeTransaction(id) 
      }  
    })
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
    let data = {}
    data.id = this.lastOptions.account_id
    let quest = confirm('Вы действительно хотите удалить счёт?')
    if(quest == true) {
      if(this.lastOptions) {
        Account.remove(data, (err, response)=> {
          if(response.success == true) {
            App.update()
            //this.renderTitle('Название счета')
            this.clear() 
          } 
        })
      }
    }  
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    let quest = confirm('Вы действительно хотите удалить эту транзакцию?')
    if(quest == true) {
      Transaction.remove(id, (err, response)=> {
        if(response.success == true) {
          App.update()
        }
      })
    }
  }  

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    this.lastOptions = options
    if(options){
      Account.get(this.lastOptions, (err, response)=> {
        if(response.success == true) {
          this.renderTitle(response.data[response.data.findIndex(item => item.id == this.lastOptions.account_id)].name)
        }
      })
      Transaction.list(options, (err, response)=> {
          this.renderTransactions(response.data)
      })
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
    content.innerHTML = ''
    if(data === []) {
      content.innerHTML = data
      this.count = 0
    }  
    for(let i in data) {
      content.insertAdjacentHTML("afterbegin", this.getTransactionHTML(data[i])) 
    } 
  }
}