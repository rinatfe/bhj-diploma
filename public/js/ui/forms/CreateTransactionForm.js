/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList()
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let listExpense = document.getElementById('expense-accounts-list')
    let listIncome = document.getElementById('income-accounts-list')
    
    Account.list(null, (err, response)=> {
      listExpense.innerHTML = '';
      listIncome.innerHTML = '';
      
      if(response.success == false) {
        throw new Error(err)
      } else { 
      for(let i in response.data) {
          
          listExpense.insertAdjacentHTML("afterbegin", `<option value="${response.data[i].id}">${response.data[i].name}</option>`)
          listIncome.insertAdjacentHTML("afterbegin", `<option value="${response.data[i].id}">${response.data[i].name}</option>`) 
      }
      } 
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {

    Transaction.create(data, (err, response)=>{
      if(response.success == true) {
        this.element.reset()
        App.modals.newExpense.onClose()
        App.modals.newIncome.onClose()
        App.update()
      }  
    })
  }
}