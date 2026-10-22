# GitHub Copilot Instructions — Vue 3 + Quasar

## 0. Idioma

- Responda sempre em português do Brasil.
- Explique decisões técnicas, análises, sugestões e justificativas em português do Brasil.
- Mantenha em inglês os elementos que fazem parte do código, como:
    - nomes de classes;
    - métodos;
    - funções;
    - variáveis;
    - propriedades;
    - interfaces;
    - enums;
    - constantes;
    - nomes de arquivos;
    - endpoints, quando seguirem o padrão existente.
- Não traduza identificadores existentes do projeto apenas para adequá-los ao português.

## 1. Contexto do projeto

Este é um frontend SPA construído com:

* Vue 3
* TypeScript
* Quasar Framework
* Vite
* Vue Router 4
* Pinia
* Axios
* Vue I18n
* VueUse
* Cypress
* ESLint
* Prettier

O frontend se comunica com uma API Laravel através de Axios.

Arquitetura geral:

```text
Vue / Quasar
    ↓
Pages / Layouts / Components
    ↓
Composables / Services
    ↓
Axios
    ↓
Laravel API
```

O backend é responsável pelas regras de negócio, persistência, integridade dos dados e validações definitivas.

O frontend é responsável por:

* Interface.
* Experiência do usuário.
* Estado da interface.
* Validações de experiência.
* Formatação.
* Navegação.
* Comunicação com a API.
* Internacionalização.
* Responsividade.
* Testabilidade.

Não duplicar regras de negócio complexas do backend no frontend.

---

# 2. Regras prioritárias

Ao gerar ou modificar código, siga esta ordem de prioridade:

1. Correção funcional.
2. Segurança.
3. Tipagem forte.
4. Arquitetura existente.
5. Manutenibilidade.
6. Testabilidade.
7. Reutilização.
8. Performance.
9. Consistência de nomenclatura.
10. Estilo.

Não introduza uma abstração apenas para seguir uma preferência estética.

Não altere a arquitetura existente sem necessidade.

Antes de criar algo novo, procure reutilizar o que já existe no projeto.

---

# 3. Vue 3

## 3.1. Composition API

Utilize a Composition API.

Prefira:

```vue
<script setup lang="ts">
```

Não utilize Options API em código novo.

---

## 3.2. Single File Components

Componentes Vue devem seguir a estrutura:

```vue
<script setup lang="ts">
</script>

<template>
</template>

<style scoped>
</style>
```

Não adicionar `<style>` quando não houver CSS customizado.

Não criar CSS customizado quando o Quasar já fornecer uma solução adequada.

---

# 4. TypeScript

## 4.1. Tipagem forte é obrigatória

Este projeto utiliza TypeScript de forma estrita.

Nunca utilize `any`.

Não gerar:

```ts
const data: any = ...
```

```ts
function handleData(data: any) {}
```

```ts
const response = value as any;
```

Procure sempre definir o tipo correto.

Utilize:

* `interface`
* `type`
* Generics
* Union types
* Utility types
* Tipos fornecidos pelas bibliotecas

quando apropriado.

---

## 4.2. Evitar `unknown` como fuga de tipagem

`unknown` pode ser utilizado quando o valor realmente é desconhecido, mas não deve ser usado para evitar a definição do tipo correto.

Depois de receber um `unknown`, faça o narrowing adequado.

---

## 4.3. Evitar casts desnecessários

Não utilize:

```ts
value as SomeType
```

apenas para silenciar o TypeScript.

Prefira corrigir a origem da tipagem.

---

## 4.4. Tipar respostas HTTP

Quando possível, tipar explicitamente as respostas da API.

Exemplo:

```ts
const response = await api.get<ProductResponse>('/products');
```

Para respostas paginadas:

```ts
const response = await api.get<ProductPaginationResponse>(
  '/products',
);
```

---

# 5. Variáveis

Utilize somente:

```ts
const
let
```

Nunca utilize `var`.

Prefira `const` sempre que não houver necessidade de reatribuição.

---

## 5.1. Nomes autoexplicativos

Os nomes devem explicar claramente o conteúdo ou finalidade.

Evitar:

```ts
const data = ...
const value = ...
const result = ...
const item = ...
const temp = ...
const aux = ...
const obj = ...
```

quando houver um nome mais específico.

Preferir:

```ts
const products = ...
const selectedProduct = ...
const productResponse = ...
const validationErrors = ...
const selectedSupplier = ...
const totalSale = ...
```

---

# 6. Refs

Refs devem possuir nomes terminados em:

```text
Ref
```

Exemplos:

```ts
const productsRef = ref<Product[]>([]);
const selectedProductRef = ref<Product | null>(null);
const loadingProductsRef = ref<boolean>(false);
const productFormRef = ref<ProductForm>({
  name: '',
  salePrice: 0,
});
```

Evitar:

```ts
const dataRef = ref([]);
const loadingRef = ref(false);
const valueRef = ref('');
```

quando o conteúdo puder ser identificado de maneira mais precisa.

---

# 7. Computed

Toda variável criada com `computed` deve possuir o sufixo:

```text
Computed
```

Exemplos:

```ts
const isAuthenticatedComputed = computed(() => {
  return user.value !== null;
});
```

```ts
const totalProductsComputed = computed(() => {
  return productsRef.value.length;
});
```

```ts
const isMobileComputed = computed<boolean>(() => {
  return $q.platform.is.mobile;
});
```

Não utilizar:

```ts
const isAuthenticated = computed(...);
```

---

## 7.1. Computed não deve possuir efeitos colaterais

Não realizar:

* Requisições HTTP.
* Alterações de estado externo.
* Notificações.
* Navegação.
* Mutação de dados.

dentro de `computed`.

Computed deve representar um valor derivado.

---

# 8. Funções

Toda função deve possuir um nome autoexplicativo.

Evitar:

```ts
handleData()
process()
execute()
action()
doSomething()
handle()
```

quando existir uma descrição melhor.

Preferir:

```ts
calculateProductSubtotal()
validateProductForm()
resetProductFilters()
openProductDialog()
submitProductForm()
removeSelectedProduct()
```

---

# 9. Requisições HTTP

Toda função que realiza uma requisição ao backend utilizando Axios deve começar com:

```text
fetch
```

e utilizar camelCase.

Exemplos:

```ts
fetchProducts()
fetchProduct()
fetchProductDetails()
fetchSuppliers()
fetchClients()
fetchSales()
fetchShopping()
fetchAuthenticatedUser()
```

Não utilizar:

```ts
getProducts()
loadProducts()
requestProducts()
requestData()
getData()
```

para funções que efetivamente fazem requisições HTTP.

---

## 9.1. Instância Axios

Utilize a instância centralizada do projeto.

Preferir:

```ts
import { api } from 'boot/axios';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');

  return response.data;
};
```

Não criar uma nova instância Axios dentro de componentes ou composables sem uma necessidade arquitetural explícita.

Não utilizar diretamente:

```ts
axios.create(...)
```

quando a instância centralizada já atender à necessidade.

---

# 10. Composables

Todos os composables devem começar com:

```text
use
```

Exemplos:

```text
useApi
useLookups
useAnimations
useClipboard
useDialog
useFormat
useHelpers
useHotkeys
useNotify
useValidations
```

---

## 10.1. Responsabilidade única

Composables devem possuir responsabilidades claras.

Evitar criar:

```text
useEverything
useUtils
useCommon
useHelpersEverything
```

que concentrem funcionalidades não relacionadas.

Preferir:

```text
useProductForm
useProductFilters
usePagination
useNotify
useClipboard
```

quando houver uma responsabilidade claramente definida.

---

# 11. Services

Quando um Service existir para determinado domínio, utilize-o para organizar a comunicação com os endpoints daquele domínio.

Exemplo:

```text
ProductService
ShoppingService
SaleService
AuthService
```

Fluxo esperado:

```text
Page
 ↓
Service / Composable
 ↓
Axios
 ↓
API
```

Services devem ser preferencialmente finos.

Não colocar regras complexas de negócio no frontend Service.

---

# 12. Componentes

## 12.1. PascalCase

Todos os arquivos `.vue` devem utilizar PascalCase.

Correto:

```text
ProductPage.vue
ProductForm.vue
ProductLayout.vue
InputText.vue
InputPassword.vue
DefaultTable.vue
ButtonGeneric.vue
```

Incorreto:

```text
product-page.vue
productPage.vue
product_form.vue
input-text.vue
```

---

# 13. Organização dos componentes

Componentes reutilizáveis devem ficar em:

```text
src/components/
```

e ser organizados por responsabilidade.

Exemplo:

```text
components/
├── buttons/
├── inputs/
├── tables/
├── modals/
├── titles/
├── charts/
└── ...
```

Não colocar indiscriminadamente todos os componentes na raiz de `components`.

Antes de criar um componente, verificar se já existe um componente reutilizável que atende à necessidade.

---

# 14. Pages, Layouts e Components

Utilize responsabilidades diferentes para cada camada.

### Pages

Representam telas/rotas da aplicação.

Exemplo:

```text
pages/products/ProductPage.vue
```

A Page pode coordenar:

* Dados.
* Filtros.
* Navegação.
* Composables.
* Services.
* Componentes da tela.

### Layouts

Representam estruturas compartilhadas de uma área do sistema.

Exemplo:

```text
ProductLayout.vue
ShoppingLayout.vue
SaleLayout.vue
```

### Components

Representam elementos reutilizáveis da interface.

Não colocar lógica específica de uma página dentro de um componente que deveria ser genérico.

---

# 15. Inputs

Todo input deve possuir `data-cy`.

Exemplo:

```vue
<q-input
  v-model="formRef.name"
  data-cy="product-name"
/>
```

```vue
<q-select
  v-model="formRef.supplierUuid"
  data-cy="shopping-supplier"
/>
```

---

## 15.1. `data-cy` deve ser semântico

Preferir:

```text
product-name
product-sale-price
shopping-supplier
login-email
login-password
login-submit
```

Evitar:

```text
input1
input2
field
test
input
element
```

Nunca utilizar índices como identificadores.

---

# 16. Quasar

Priorize os recursos nativos do Quasar.

Antes de criar:

* CSS.
* Componentes próprios.
* Helpers.
* Layouts customizados.
* Soluções de responsividade.

verifique se o Quasar já fornece a solução.

Utilize componentes como:

```text
QBtn
QInput
QSelect
QDate
QDialog
QCard
QTable
QForm
QBanner
QTabs
QExpansionItem
QSeparator
```

quando forem adequados.

---

# 17. Classes Quasar

Priorize classes utilitárias do Quasar.

Exemplo:

```html
<div class="row items-center q-pa-md">
```

```html
<div class="row q-col-gutter-md">
```

```html
<div class="col-12 col-md-6">
```

Utilize classes como:

```text
row
column
flex
flex-center
items-center
justify-center
q-pa-*
q-px-*
q-py-*
q-ma-*
q-mx-*
q-my-*
q-gutter-*
col-*
```

quando apropriado.

---

# 18. CSS

Evite CSS inline para layout.

Não gerar:

```html
<div style="display: flex; align-items: center; padding: 16px">
```

quando existir equivalente no Quasar.

Preferir:

```html
<div class="row items-center q-pa-md">
```

---

## 18.1. Evitar valores "mockados"

Evite:

```html
<q-card style="width: 500px; margin-top: 20px;">
```

quando for possível utilizar classes ou componentes do Quasar.

Não criar dezenas de valores fixos de CSS apenas para reproduzir algo que o Quasar já resolve.

CSS customizado é permitido quando realmente necessário.

---

## 18.2. `<style scoped>`

Quando CSS customizado for necessário, prefira:

```vue
<style scoped>
</style>
```

para evitar vazamento de estilos.

---

# 19. Responsividade

Priorize o sistema responsivo do Quasar.

Utilize:

```text
col-xs-*
col-sm-*
col-md-*
col-lg-*
col-xl-*
```

e demais recursos responsivos do Quasar.

Evite implementar breakpoints manualmente quando o Quasar já fornecer a solução.

---

# 20. Templates

Mantenha o template simples e legível.

Evite lógica complexa diretamente no template.

Não fazer:

```vue
{{ products.filter(...).map(...).join(...) }}
```

Prefira uma `computed`:

```ts
const activeProductNamesComputed = computed(() => {
  return productsRef.value
    .filter((product) => product.active)
    .map((product) => product.name)
    .join(', ');
});
```

e:

```vue
{{ activeProductNamesComputed }}
```

---

# 21. Props

Props devem ser fortemente tipadas.

Preferir:

```ts
interface Props {
  product: Product;
  readonly?: boolean;
}

const props = defineProps<Props>();
```

Não utilizar:

```ts
defineProps<any>();
```

---

# 22. Emits

Events também devem ser tipados.

Preferir:

```ts
const emit = defineEmits<{
  submit: [product: Product];
  cancel: [];
}>();
```

Evitar emits genéricos ou sem tipagem quando a estrutura do evento for conhecida.

---

# 23. v-model

Utilize `v-model` de forma consistente.

Componentes reutilizáveis devem seguir as convenções do Vue 3 para `modelValue` quando necessário.

Não criar APIs de componentes inconsistentes sem motivo.

---

# 24. Formulários

Utilize `QForm` quando apropriado.

O estado do formulário deve ser fortemente tipado.

Evitar:

```ts
const formRef = ref({});
```

Preferir:

```ts
const formRef = ref<ProductForm>({
  name: '',
  salePrice: 0,
  amount: 0,
});
```

---

# 25. Loading

Evite um estado genérico quando existem operações independentes.

Evitar:

```ts
const loadingRef = ref(false);
```

quando a página realiza diversas operações independentes.

Preferir:

```ts
const loadingProductsRef = ref(false);
const loadingSuppliersRef = ref(false);
const loadingSubmitRef = ref(false);
```

Cada loading deve representar claramente a operação correspondente.

---

# 26. Async / Await

Prefira `async/await` para operações assíncronas.

Preferir:

```ts
const fetchProducts = async (): Promise<void> => {
  loadingProductsRef.value = true;

  try {
    const response = await api.get<ProductResponse[]>('/products');

    productsRef.value = response.data;
  } finally {
    loadingProductsRef.value = false;
  }
};
```

Evitar cadeias excessivas de `.then()` quando `async/await` deixar o código mais legível.

---

# 27. Tratamento de erros

Não engolir erros silenciosamente.

Evitar:

```ts
try {
  await fetchProducts();
} catch {
}
```

sem uma razão clara.

Utilizar os mecanismos existentes de tratamento de erros, incluindo notificações e interceptors do Axios.

Não duplicar em cada componente o tratamento global já existente.

---

# 28. Watch

Não utilizar `watch` como primeira solução.

Antes de criar um `watch`, verificar se o problema pode ser resolvido com:

* `computed`.
* Evento.
* Função explícita.
* `v-model`.
* Lifecycle hook.
* Alteração direta do estado.

Utilize `watch` quando realmente for necessário reagir a uma mudança de estado.

Evite watchers que possam criar ciclos de atualização.

---

# 29. Pinia

Utilize Pinia para estado realmente global ou compartilhado.

Não coloque na store:

* Estado temporário de formulário.
* Estado visual exclusivo de um componente.
* Dados que não precisam ser compartilhados.
* Estado que pertence claramente a uma única Page.

Evite transformar toda variável em estado global.

---

# 30. Router

Respeite a arquitetura de rotas existente.

Rotas protegidas devem continuar utilizando o mecanismo de autenticação existente.

Não duplicar a lógica de autenticação em cada Page.

Utilize Vue Router para navegação programática quando necessário.

Evite manipular `window.location` para navegação interna da SPA.

Preferir:

```ts
router.push(...)
```

ou:

```ts
router.replace(...)
```

---

# 31. Internacionalização

Textos exibidos ao usuário devem utilizar Vue I18n quando forem traduzíveis.

Preferir:

```ts
const { t } = useI18n();
```

e:

```ts
t('actions.save')
```

Evitar strings fixas no template:

```vue
<q-btn label="Salvar" />
```

quando o texto fizer parte da interface traduzível.

Não duplicar traduções manualmente em componentes.

---

# 32. Acessibilidade

Ao criar componentes, considere acessibilidade.

Priorize:

* Labels apropriados.
* `aria-*` quando necessário.
* Navegação por teclado.
* Estados de foco.
* Contraste.
* Botões semanticamente corretos.
* Inputs associados às suas labels.

Não substituir um botão por uma `div` clicável sem necessidade.

Preferir componentes semânticos do Quasar.

---

# 33. Performance

Evite:

* Requisições HTTP duplicadas.
* Requisições dentro de loops.
* Computeds desnecessariamente pesados.
* Watchers excessivos.
* Renderização de listas sem necessidade.
* Processamento repetido dentro do template.
* Estado duplicado.

Não fazer otimizações prematuras.

Primeiro priorize código correto e legível.

---

# 34. Reutilização

Antes de criar:

```text
Input
Button
Modal
Table
Pagination
Dialog
Formatter
Composable
Helper
```

verifique se já existe uma implementação no projeto.

Não criar componentes paralelos que resolvam o mesmo problema.

Se dois componentes forem praticamente iguais, avalie se existe uma abstração realmente útil.

Não criar abstrações genéricas apenas para eliminar poucas linhas.

---

# 35. Evitar overengineering

Não introduza:

* Design Patterns desnecessários.
* Classes apenas para encapsular funções simples.
* Factories sem necessidade.
* Abstrações excessivamente genéricas.
* Sistemas de configuração complexos.
* Camadas adicionais sem responsabilidade clara.

Uma implementação simples e explícita é preferível a uma abstração complexa sem benefício real.

---

# 36. Regras de negócio

O frontend não deve ser a fonte definitiva de regras de negócio.

O backend é responsável por:

* Estoque.
* Custo médio.
* Lucro.
* Integridade de compras.
* Integridade de vendas.
* Cancelamentos.
* Permissões.
* Validações de domínio.
* Segurança.

O frontend pode validar dados para melhorar a experiência do usuário, mas nunca deve assumir que essa validação substitui a validação da API.

---

# 37. Segurança

Nunca adicionar:

* Senhas em código.
* Tokens hardcoded.
* Credenciais.
* Chaves privadas.
* Segredos.
* Informações sensíveis em logs.

Nunca gerar:

```ts
console.log(user);
console.log(response);
console.log(token);
console.log(form);
```

em código de produção quando houver possibilidade de exposição de dados sensíveis.

Não colocar segredos em arquivos versionados.

---

# 38. Logs

Remova logs temporários antes de finalizar uma alteração.

Evitar:

```ts
console.log(...)
console.debug(...)
console.table(...)
```

sem necessidade.

Se um log permanente for realmente necessário, ele deve possuir uma finalidade clara e não expor informações sensíveis.

---

# 39. Cypress

Todo novo elemento de entrada deve possuir:

```html
data-cy
```

Os identificadores devem ser estáveis e semânticos.

Preferir:

```ts
cy.get('[data-cy="product-name"]')
```

a seletores baseados em:

* Classes CSS.
* Texto.
* `nth-child`.
* Estrutura HTML.
* Índices.
* IDs gerados automaticamente.

Ao criar fluxos importantes, considerar como eles serão testados pelo Cypress.

---

# 40. ESLint e Prettier

O código gerado deve respeitar:

* ESLint.
* Prettier.
* TypeScript.
* Vue ESLint rules.

Não desabilitar regras do ESLint sem motivo técnico.

Evitar:

```ts
// eslint-disable-next-line
```

quando a regra puder ser respeitada corretamente.

Não formatar manualmente de maneira que contradiga o Prettier.

---

# 41. Imports

Mantenha imports:

* Necessários.
* Organizados.
* Sem duplicações.
* Sem imports não utilizados.

Não importar algo "por garantia".

Remova imports que deixarem de ser utilizados após uma alteração.

---

# 42. Comentários

O código deve ser autoexplicativo.

Não adicionar comentários para explicar operações óbvias.

Evitar:

```ts
// Incrementa a quantidade
product.amount++;
```

Comentários devem explicar principalmente:

* Decisões não óbvias.
* Workarounds.
* Restrições externas.
* Motivos arquiteturais.
* Comportamentos inesperados.

---

# 43. Refatoração

Ao refatorar código existente:

1. Preserve o comportamento atual.
2. Não altere contratos da API sem necessidade.
3. Não altere nomes públicos sem necessidade.
4. Preserve os testes existentes.
5. Evite misturar refatoração estrutural com mudanças funcionais grandes.
6. Faça alterações pequenas e verificáveis.
7. Mantenha compatibilidade com os componentes existentes.

Não refatore arquivos não relacionados apenas por preferência pessoal.

---

# 44. Alterações mínimas

Ao implementar uma tarefa, altere somente o necessário.

Não:

* Reformatar arquivos inteiros sem necessidade.
* Renomear dezenas de variáveis não relacionadas.
* Migrar bibliotecas sem solicitação.
* Alterar arquitetura inteira para resolver um problema pequeno.
* Refatorar módulos não relacionados.

Evite aumentar o escopo da alteração.

---

# 45. Dependências

Não adicionar uma nova dependência npm sem necessidade.

Antes de adicionar uma biblioteca:

1. Verifique se Vue ou Quasar já oferecem a funcionalidade.
2. Verifique se uma dependência existente já resolve o problema.
3. Avalie se uma implementação pequena e nativa seria suficiente.
4. Só então considere adicionar uma nova dependência.

Não adicionar bibliotecas apenas para funcionalidades triviais.

---

# 46. API e contratos

Não assumir formatos de resposta da API.

Quando um endpoint já existir, siga o contrato utilizado pelo projeto.

Não inventar campos.

Não alterar nomes de propriedades retornadas pela API no frontend sem necessidade.

Se o contrato da API estiver indefinido, sinalize a necessidade de confirmação.

---

# 47. Paginação

As telas que utilizam paginação server-side devem respeitar o padrão existente do projeto.

Não implementar paginação client-side para grandes conjuntos de dados quando o endpoint já fornece paginação server-side.

Manter separados:

* Página atual.
* Quantidade por página.
* Total.
* Ordenação.
* Direção.
* Filtros.

---

# 48. Dados derivados

Não armazenar no estado dados que podem ser calculados de maneira confiável a partir de outros estados.

Evitar:

```ts
const totalProductsRef = ref(0);
```

se o valor puder ser derivado diretamente de:

```ts
productsRef.value.length
```

Nesse caso, preferir:

```ts
const totalProductsComputed = computed(() => {
  return productsRef.value.length;
});
```

Isso evita estados duplicados e inconsistentes.

---

# 49. Mutabilidade

Evite mutações desnecessárias de objetos compartilhados.

Prefira operações previsíveis e explícitas.

Ao manipular listas, tenha cuidado para não alterar inadvertidamente o estado utilizado por outros componentes ou stores.

---

# 50. Listas e `v-for`

Sempre que apropriado, utilize `:key` estável.

Preferir:

```vue
<div
  v-for="product in productsRef"
  :key="product.uuid"
>
```

Evitar utilizar o índice como key quando existir um identificador estável:

```vue
:key="index"
```

---

# 51. Dados assíncronos

Considere sempre os estados:

```text
loading
success
empty
error
```

Uma tela que depende de uma API não deve considerar apenas o estado de sucesso.

Quando aplicável, forneça:

* Loading.
* Estado vazio.
* Erro.
* Conteúdo.

---

# 52. Código gerado pelo Copilot

Ao gerar código novo:

1. Procure padrões semelhantes no projeto.
2. Reutilize tipos existentes.
3. Reutilize componentes existentes.
4. Reutilize composables existentes.
5. Reutilize Services existentes.
6. Siga a nomenclatura definida neste documento.
7. Utilize Quasar antes de CSS customizado.
8. Utilize TypeScript forte.
9. Adicione `data-cy` aos inputs.
10. Não introduza `any`.
11. Não crie abstrações desnecessárias.

Não invente uma nova arquitetura quando a existente já resolver o problema.

---

# 53. Checklist antes de finalizar uma alteração

Antes de considerar uma alteração concluída, verificar:

## Código

* [ ] Não existe `any`.
* [ ] Não existe `var`.
* [ ] Variáveis possuem nomes autoexplicativos.
* [ ] Refs possuem sufixo `Ref`.
* [ ] Computeds possuem sufixo `Computed`.
* [ ] Funções HTTP começam com `fetch`.
* [ ] Composables começam com `use`.
* [ ] Componentes `.vue` estão em PascalCase.
* [ ] Props e emits estão tipados.
* [ ] Não existem casts desnecessários.

## Vue

* [ ] Código novo utiliza Composition API.
* [ ] Código novo utiliza `<script setup lang="ts">`.
* [ ] Não existe lógica complexa desnecessária no template.
* [ ] `computed` é utilizado para dados derivados.
* [ ] `watch` foi utilizado somente quando necessário.
* [ ] Lifecycle hooks possuem responsabilidades claras.

## Quasar

* [ ] Recursos nativos do Quasar foram priorizados.
* [ ] Classes utilitárias do Quasar foram utilizadas quando adequadas.
* [ ] Não existe CSS inline desnecessário.
* [ ] Não existem estilos "mockados" que poderiam ser classes Quasar.
* [ ] Layout é responsivo.

## Componentes

* [ ] Componente está na pasta correta.
* [ ] Categoria do componente faz sentido.
* [ ] Não existe componente duplicado.
* [ ] Responsabilidade do componente está clara.
* [ ] Inputs possuem `data-cy`.

## API

* [ ] Requisições utilizam Axios centralizado.
* [ ] Funções HTTP começam com `fetch`.
* [ ] Respostas estão tipadas.
* [ ] Não existem requisições duplicadas.
* [ ] Regras de negócio continuam no backend.

## UX

* [ ] Existe loading quando necessário.
* [ ] Existe tratamento de erro quando necessário.
* [ ] Estado vazio foi considerado.
* [ ] Textos traduzíveis utilizam i18n.
* [ ] Navegação utiliza Vue Router.
* [ ] Acessibilidade básica foi considerada.

## Qualidade

* [ ] Não existem logs de debug.
* [ ] Não existem imports não utilizados.
* [ ] ESLint continua válido.
* [ ] Prettier continua válido.
* [ ] Código é testável.
* [ ] Alterações não relacionadas não foram incluídas.
* [ ] Não foi adicionada dependência desnecessária.

---

# 54. Regra final

Sempre prefira:

```text
Código simples
+
Tipagem forte
+
Nomes explícitos
+
Componentes reutilizáveis
+
Quasar
+
Composition API
+
Arquitetura existente
+
Testabilidade
```

em vez de:

```text
Abstração excessiva
+
any
+
CSS improvisado
+
Estado duplicado
+
Lógica complexa no template
+
Componentes gigantes
+
Requisições espalhadas
+
Regras de negócio duplicadas
```

O código deve ser escrito de forma que outro desenvolvedor consiga entender **o que ele faz, por que existe e onde sua responsabilidade começa e termina**, sem precisar reconstruir a arquitetura mentalmente.
