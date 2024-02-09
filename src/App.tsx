import { ChangeEvent, useState } from "react";
import logo from "./assets/Logo.svg";
import { NewNoteCard } from "./components/NewNoteCard";
//Componentes
import { NoteCard } from "./components/NoteCard";

interface Note {
  id: string;
  date: Date;
  content: string;
}
//fazer os exports sem o defalut, para que eles não possam ser
// importados com outro nome
export function App() {
  const [search, setSearch] = useState("");
  //useState para armazenar e estruturar os dados de novas notas
  //setando o estado como uma função para poder passar condições a ela
  const [notes, setNotes] = useState<Note[]>(() => {
    //pegando dados do localStorage
    const notesOnStorage = localStorage.getItem("notes");
    //se o localStorage estiver com algo salvo
    if (notesOnStorage) {
      //retorna em tela
      return JSON.parse(notesOnStorage);
    }
    //se não estiver nada salvo retorna o array vazio
    return [];
  });
  //função para pegar dados do componente filho (newNoteCard) sendo passada por props.
  function onNoteCreated(content: string) {
    const newNote = {
      //para gerar um numero único sem repetir, porém o dado é em string.
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    //variavel que salva as notas. salvo em uma variável para que ela possa ser usada várias vezes
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    //salvando no localStorage
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
    console.log(query);
  }
  //variavel que filtra o array notes(que tem todas as notas salvas) e retorna os array com condições
  const filteredNotes =
    search !== " "
      ? notes.filter((note) =>
          //tratamento do que foi digitado para letra minuscula
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 ">
      <img src={logo} alt="NLW Expert" />
      <form className="w-full">
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-400"
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
        />
      </form>
      {/* separador */}
      <div className="h-px bg-slate-700">
        {/* cards das notas */}
        <div className="grid grid-cols-3 gap-6 auto-rows-[250px] ">
          <NewNoteCard onNoteCreated={onNoteCreated} />

          {/* map para exibir em tela o array filtrado no input search */}
          {filteredNotes.map((note) => {
            return <NoteCard note={note} key={note.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
