let notes = []
let undo_redo=[]
const list=document.querySelector('.list')
const todobtn=document.querySelector('.todosbtn')
const notebtn=document.querySelector('.notesbtn')

//custom toast function
function custom_alert(text) {
  const popup = document.createElement('div')
  popup.className = 'popup'
  popup.textContent = text
  document.body.appendChild(popup)
  setTimeout(() => {
    popup.remove()
  }, 3000)
}

//this function displays all notes
function reload_notes() {
  list.innerHTML=""
  const todobtn = document.querySelector('.todosbtn')
  const notebtn = document.querySelector('.notesbtn')
  todobtn.style.border = '1px solid white';
  notebtn.style.border = '3px solid white';
  notes.forEach(note => {
    let title = note.title
    let text = note.text
    let uid = note.uid
    add_to_list(title, text, uid)
  })
}
reload_notes()
//function for adding an specific note
function add_to_list(title, text, uid) {
  const item = document.createElement("div");
  item.className = "note_item";
  item.addEventListener('click', (e) => {
    ntitle.value = title;
    ntext.value = text;
    current_uid = uid;
    document.querySelector('.bg_holder').style.display = 'flex';
    document.querySelector('.background_page').style.display = 'none';
    ntext.focus()
  })
  
  const titleDiv = document.createElement("div");
  titleDiv.className = "nitemtitle";
  titleDiv.textContent = `${(title||"").slice(0,20)}...`;
  
  const textDiv = document.createElement("div");
  textDiv.className = "nitemtext";
  textDiv.textContent = `${(text||"").slice(0,450)}...`;
  
  const n_delete_btn = document.createElement('span')
  n_delete_btn.className = 'material-symbols-outlined note_delete'
  n_delete_btn.textContent='delete'
  n_delete_btn.addEventListener('click', (e) => {
    e.stopPropagation()
    let delete_note = confirm('Do you want to delete this note.')
    if (delete_note) {
      notes = notes.filter(note => note.uid !== uid)
      reload_notes()
    }
  })
  const note_tools = document.createElement('div')
  note_tools.className = 'note_tools'
  
  note_tools.appendChild(n_delete_btn)
  item.appendChild(note_tools)
  item.appendChild(titleDiv);
  item.appendChild(textDiv);

  document.querySelector('.list').prepend(item); // or any container
}


let current_uid = null;
const npage = document.createElement('section')
npage.className = 'note_page'

const ntitle = document.createElement('textarea')
ntitle.className = 'note_title'
ntitle.placeholder = 'Title'

const ntext = document.createElement('textarea')
ntext.className = 'note_text'
ntext.placeholder = 'note'
ntext.addEventListener('input',()=>{
  undo_redo.push(ntext.value)
})
const topbar=document.createElement('div')
topbar.classList='topbar'

const checkbtn = document.createElement('span')
checkbtn.textContent = "arrow_back"
checkbtn.classList = 'check_icon material-symbols-outlined'
checkbtn.addEventListener('click', () => {
    if (ntitle.value.trim() || ntext.value.trim()) {
      let note = notes.find(note => note.uid === current_uid)
      if (note) {
        note.title = ntitle.value;
        note.text = ntext.value;
        reload_notes()
        current_uid=null;
        custom_alert('Note edited successfully')
      }
      else {
        note = {
          title: ntitle.value,
          text: ntext.value,
          uid: Date.now().toString(36) + Math.random().toString(36),
        }
        notes.push(note)
        reload_notes()
        custom_alert("Note Saved successfully.")
      }
    }
    else {
      custom_alert('Empty note discarded.')
    }
    document.querySelector('.bg_holder').style.display = 'none';
    document.querySelector('.background_page').style.display = 'block';
    ntitle.value=""
    ntext.value=""
  }
)

const editbar = document.createElement('div')
editbar.className = 'edit_bar'

const undo = document.createElement('span')
undo.textContent = 'undo'
undo.classList= 'undo_icon material-symbols-outlined'
undo.id = 'undo_icon'

const redo = document.createElement('span')
redo.textContent = 'redo'
redo.classList='redo_icon material-symbols-outlined'

npage.appendChild(ntitle)
npage.appendChild(ntext)
topbar.appendChild(checkbtn)
editbar.appendChild(undo)
editbar.appendChild(redo)

document.querySelector('.bg_holder').appendChild(topbar)
document.querySelector('.bg_holder').appendChild(npage)
document.querySelector('.bg_holder').appendChild(editbar)



document.getElementById('create_icon').addEventListener('click', () => {
  ntitle.value="";
  ntext.value="";
  document.querySelector('.bg_holder').style.display = 'flex';
  document.querySelector('.background_page').style.display = 'none';
  ntext.focus()
})


 
notebtn.addEventListener('click',()=>{
  list.innerHTML=""
  reload_notes()
  todobtn.style.border='1px solid white';
  notebtn.style.border='3px solid white';
})

todobtn.addEventListener('click',()=>{
  custom_alert('feature not available.')
  //todobtn.style.border='3px solid white';
 // notebtn.style.border='1px solid white';
})