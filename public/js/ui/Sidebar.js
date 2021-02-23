/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    let mini = document.querySelector('.sidebar-mini')
    let buttonSide = document.querySelector('[data-toggle]')
    buttonSide.addEventListener('click',()=> {
        mini.classList.toggle('sidebar-open');
        mini.classList.toggle('sidebar-collapse')   
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    let registration = App.getModal('register')
    let login = App.getModal('login')
    document.querySelector('.menu-item_register').addEventListener('click', ()=> {
      registration.open()
    })
    document.querySelector('.menu-item_login').addEventListener('click', ()=> {
      login.open()
    })
    document.querySelector('.menu-item_logout').addEventListener('click', (err, response)=> {
      User.logout()
      App.setState( 'init' )
    })
  }
}