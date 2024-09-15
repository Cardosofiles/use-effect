import { useEffect, useState } from "react";

// Função simulando uma chamada à API para alertar que a lista foi salva.
function toWarnAPI() {
  console.log("Lista salva!");
}

function Section() {
  // Estado que armazena a lista de repositórios. Inicialmente, um array vazio.
  const [list, setList] = useState<string[]>([]);

  // Estado que armazena o valor digitado no input de filtro.
  const [filter, setFilter] = useState("");

  // Estado que armazena a lista filtrada com base no `filter`.
  const [fileredList, setFileredList] = useState<string[]>([]);

  // Estado que armazena o valor digitado no input de usuário do GitHub.
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * useEffect para executar uma ação quando a `list` é alterada.
   * Aqui, chamamos a função `toWarnAPI` sempre que a lista for atualizada.
   * Isso simula, por exemplo, uma notificação de que os dados foram salvos ou alterados.
   * A dependência [list] garante que esse efeito será executado sempre que o valor de `list` mudar.
   */
  useEffect(() => {
    if (list.length !== 0) {
      toWarnAPI();
    }
  }, [list]);

  /**
   * useEffect que faz a requisição à API do GitHub para obter os repositórios do usuário.
   * Esse efeito será executado sempre que o valor de `inputValue` mudar, ou seja,
   * sempre que o usuário digitar um novo nome de usuário do GitHub.
   *
   * A função fetch faz a chamada à API, obtém a resposta no formato JSON, e depois
   * mapeia os dados para extrair o nome completo dos repositórios (full_name),
   * armazenando-os no estado `list`.
   *
   * Adiciona `inputValue` como dependência, de modo que o efeito é reexecutado sempre
   * que `inputValue` mudar.
   */
  useEffect(() => {
    // Verifica se `inputValue` não está vazio antes de fazer a requisição
    if (inputValue !== "") {
      fetch(`https://api.github.com/users/${inputValue}/repos`)
        .then((response) => response.json()) // Converte a resposta para JSON
        .then((data) => {
          // Atualiza o estado `list` com o nome completo dos repositórios
          setList(data.map((item: any) => item.full_name));
        })
        .catch((error) => console.error("Erro ao buscar repositórios:", error)); // Tratamento de erros
    }
  }, [inputValue]); // Dependência para reexecutar sempre que `inputValue` mudar

  /**
   * useEffect responsável por filtrar a lista de repositórios com base no valor de `filter`.
   * A cada mudança no `filter` ou na `list`, o efeito é reexecutado para aplicar o filtro,
   * atualizando o estado `fileredList` com os itens que contêm o termo digitado no filtro.
   *
   * A dependência [filter, list] garante que o efeito seja reexecutado sempre que
   * o filtro ou a lista completa mudarem.
   */
  useEffect(() => {
    setFileredList(list.filter((item) => item.includes(filter))); // Filtra os itens que contêm o valor do filtro
  }, [filter, list]); // Dependências: `filter` e `list`

  /**
   * Função para adicionar um novo item "Novo item" à lista `list`.
   * Utiliza o estado anterior (`state`) e adiciona um novo valor à lista.
   */
  function addToList() {
    setList((state) => [...state, "Novo item"]); // Adiciona "Novo item" ao final da lista
  }

  /**
   * Função que lida com a mudança no input onde o usuário digita o nome de usuário do GitHub.
   * A cada mudança no valor do input, o estado `inputValue` é atualizado.
   *
   * @param event - Evento de mudança no campo de input.
   */
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Atualiza o estado `inputValue` com o valor digitado
  };

  return (
    <div className="space-y-5">
      <h1>useEffect | React Hook</h1>

      {/* Input para digitar o nome do usuário do GitHub */}
      <input
        type="text"
        value={inputValue}
        onChange={handleChangeInput} // Chama a função handleChangeInput sempre que o valor do input mudar
        className="p-2 rounded-md w-full"
        placeholder="Escolha o Usuário do GitHub"
      />

      <h2>Filtro da API do GitHub | Repositórios</h2>

      {/* Input para digitar a palavra-chave usada para filtrar a lista de repositórios */}
      <input
        type="text"
        onChange={(e) => setFilter(e.target.value)} // Atualiza o valor do `filter` sempre que o valor do input mudar
        value={filter}
        className="p-2 rounded-md w-full"
        placeholder="Palavra chave"
      />

      {/* Se o filtro estiver preenchido, mostra a lista filtrada; caso contrário, exibe uma mensagem */}
      {filter ? (
        <ul>
          {fileredList.map((item, index) => (
            <li
              key={index} // Usa `index` como chave única para cada item da lista
              className="border border-zinc-300 rounded-md my-2 hover:bg-violet-600 hover:text-zinc-950 hover:font-bold px-2"
            >
              {item} {/* Exibe o nome do repositório filtrado */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Digite uma palavra-chave para filtrar os repositórios.</p> // Mensagem padrão quando o filtro está vazio
      )}

      <h2>Listando os 20 primeiros repositórios do Usuário</h2>

      {/* Mostra a lista completa de repositórios, independentemente do filtro */}
      <ul>
        {list.map((item, index) => (
          <li
            key={index} // Usa `index` como chave única para cada item da lista
            className="border border-zinc-300 rounded-md my-2 hover:bg-violet-600 hover:text-zinc-950 hover:font-bold px-2"
          >
            {item} {/* Exibe o nome completo do repositório */}
          </li>
        ))}
      </ul>

      {/* Botão para adicionar um novo item à lista */}
      <button onClick={addToList}>Add to list</button>
    </div>
  );
}

export default Section;
