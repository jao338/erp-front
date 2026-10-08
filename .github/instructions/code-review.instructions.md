# Code Review — Frontend Vue 3 + Quasar

## 1. Objetivo

Este documento define as regras e critérios que devem ser utilizados durante o **Code Review do frontend** deste projeto.

O projeto utiliza:

* Vue 3
* TypeScript
* Quasar Framework
* Vite
* Vue Router
* Pinia
* Axios
* Vue I18n
* VueUse
* Cypress
* ESLint
* Prettier

A aplicação é uma SPA e se comunica com o backend exclusivamente através da API, utilizando Axios como camada HTTP.

O objetivo do Code Review é garantir:

* Código legível e previsível.
* Tipagem forte.
* Componentes reutilizáveis.
* Separação adequada de responsabilidades.
* Uso consistente dos recursos do Quasar.
* Nomenclatura autoexplicativa.
* Baixa duplicação.
* Facilidade de manutenção.
* Testabilidade.
* Consistência arquitetural.
* Evitar soluções improvisadas ou desnecessariamente complexas.

---

# 2. Regras gerais

## 2.1. Código deve ser simples e explícito

Priorizar código:

* Legível.
* Direto.
* Autoexplicativo.
* Fácil de manter.
* Fácil de testar.

Evitar abstrações criadas apenas para reduzir algumas linhas de código.

Não introduzir:

* Classes desnecessárias.
* Design Patterns sem necessidade real.
* Helpers genéricos excessivamente abrangentes.
* Abstrações prematuras.
* Funções que fazem várias responsabilidades diferentes.

Antes de sugerir uma abstração, verificar se ela realmente reduz duplicação ou melhora a organização do código.

---

# 3. TypeScript

## 3.1. Tipagem forte é obrigatória

O projeto deve utilizar TypeScript de forma estrita.

### Não utilizar `any`

É proibido utilizar:

```ts
any
```

Exemplos que devem ser evitados:

```ts
const response: any = ...
```

```ts
const data = value as any;
```

```ts
function handleResponse(data: any) {}
```

Quando o tipo não for conhecido, deve-se definir uma interface, type, generic ou utilizar um tipo apropriado.

Exemplo:

```ts
interface ProductResponse {
  uuid: string;
  name: string;
  amount: number;
  sale_price: number;
}
```

---

## 3.2. Evitar casts desnecessários

Não utilizar `as` apenas para silenciar o TypeScript.

Evitar:

```ts
const product = response.data as Product;
```

quando o tipo puder ser corretamente definido na origem.

Preferir:

```ts
const response: AxiosResponse<Product> = await api.get<Product>(
  `/products/${uuid}`,
);
```

---

## 3.3. Interfaces e types devem representar o domínio

Os tipos devem refletir os dados realmente utilizados pela aplicação.

Evitar tipos genéricos como:

```ts
Record<string, unknown>
```

quando existe uma estrutura conhecida.

Preferir:

```ts
interface ProductFilter {
  name?: string;
  page: number;
  per_page: number;
}
```

---

# 4. Variáveis

## 4.1. Utilizar `const` ou `let`

Sempre utilizar:

```ts
const
```

ou:

```ts
let
```

Nunca introduzir `var`.

---

## 4.2. Preferir `const`

Quando a referência não precisa ser reatribuída:

```ts
const productName = 'Produto';
```

Não:

```ts
let productName = 'Produto';
```

Se o valor precisar ser alterado, utilizar `let`.

---

## 4.3. Nomes autoexplicativos

Toda variável deve deixar claro o que representa.

Evitar:

```ts
const data = ...
const value = ...
const item = ...
const result = ...
const response = ...
const aux = ...
const temp = ...
```

quando existir um nome mais específico.

Preferir:

```ts
const products = ...
const selectedProduct = ...
const productResponse = ...
const totalSale = ...
const validationErrors = ...
const selectedSupplier = ...
```

O nome deve permitir entender a finalidade da variável sem precisar analisar toda a função.

---

# 5. Refs

## 5.1. Nomenclatura

Refs devem possuir nomes autoexplicativos e seguir o padrão:

```text
<nome>Ref
```

Exemplo:

```ts
const productsRef = ref<Product[]>([]);
const loadingProductsRef = ref<boolean>(false);
const selectedProductRef = ref<Product | null>(null);
```

Não utilizar nomes genéricos.

Evitar:

```ts
const dataRef = ref([]);
const loadingRef = ref(false);
const valueRef = ref('');
```

quando for possível identificar especificamente o que está sendo armazenado.

---

## 5.2. Tipagem explícita

Quando necessário, informar o tipo do ref:

```ts
const productsRef = ref<Product[]>([]);
```

```ts
const selectedProductRef = ref<Product | null>(null);
```

```ts
const isLoadingRef = ref<boolean>(false);
```

Evitar refs sem tipagem quando isso resultar em perda de segurança ou inferência inadequada.

---

# 6. Computed

## 6.1. Sufixo obrigatório

Toda variável criada com `computed` deve terminar com:

```text
Computed
```

Exemplo:

```ts
const isAuthenticatedComputed = computed(() => {
  return user.value !== null;
});
```

```ts
const totalProductsComputed = computed(() => {
  return products.value.length;
});
```

```ts
const isMobileComputed = computed<boolean>(() => {
  return $q.platform.is.mobile;
});
```

Não:

```ts
const isAuthenticated = computed(...);
```

Não:

```ts
const totalProducts = computed(...);
```

---

## 6.2. Computed deve representar valor derivado

Não utilizar `computed` para executar efeitos colaterais.

Evitar:

```ts
const valueComputed = computed(() => {
  fetchProducts();
  return products.value;
});
```

`computed` deve apenas calcular e retornar um valor derivado.

---

# 7. Funções

## 7.1. Nomes autoexplicativos

Funções devem possuir nomes que expliquem claramente sua ação.

Evitar:

```ts
function handleData() {}
function process() {}
function execute() {}
function action() {}
function doSomething() {}
```

Preferir:

```ts
function calculateProductSubtotal() {}
function validateProductForm() {}
function resetProductFilters() {}
function openProductDialog() {}
```

---

# 8. Requisições HTTP

## 8.1. Prefixo `fetch`

Toda função que realiza uma requisição ao backend utilizando Axios deve começar com:

```text
fetch
```

e utilizar camelCase.

Exemplos:

```ts
fetchProducts()
fetchProduct()
fetchSuppliers()
fetchClients()
fetchProductDetails()
fetchSales()
```

Não utilizar:

```ts
getProducts()
loadProducts()
requestProducts()
requestData()
getData()
```

quando a função efetivamente executa uma requisição HTTP ao backend.

---

## 8.2. O nome deve representar a operação

Evitar:

```ts
const fetchData = async () => {};
```

Preferir:

```ts
const fetchProducts = async () => {};
```

ou:

```ts
const fetchProductDetails = async () => {};
```

---

## 8.3. Axios

As chamadas HTTP devem utilizar a instância centralizada do projeto.

Preferir:

```ts
import { api } from 'boot/axios';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');

  return response.data;
};
```

Evitar criar novas instâncias de Axios dentro de componentes:

```ts
axios.create(...)
```

ou:

```ts
axios.get(...)
```

quando a instância centralizada já estiver disponível.

A aplicação possui uma configuração centralizada em `src/boot/axios.ts`, incluindo `baseURL`, credenciais, XSRF e interceptors.

---

# 9. Composables

## 9.1. Prefixo obrigatório

Todo composable deve começar com:

```text
use
```

Exemplos:

```ts
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

Esse padrão já faz parte da organização atual do projeto.

---

## 9.2. Composables devem possuir responsabilidade clara

Evitar composables que concentrem responsabilidades não relacionadas.

Evitar:

```ts
useEverything()
useUtils()
useCommon()
```

quando o composable possuir dezenas de responsabilidades diferentes.

Preferir:

```ts
useProductForm()
useProductFilters()
usePagination()
useNotify()
useClipboard()
```

quando houver uma responsabilidade clara.

---

# 10. Componentes Vue

## 10.1. PascalCase obrigatório

Todos os arquivos `.vue` devem utilizar **PascalCase**.

Correto:

```text
ProductForm.vue
ProductPage.vue
ProductLayout.vue
InputText.vue
InputPassword.vue
DefaultTable.vue
ButtonGeneric.vue
```

Incorreto:

```text
product-form.vue
productPage.vue
product_form.vue
input-text.vue
```

---

# 11. Organização dos componentes

Os componentes devem permanecer dentro de:

```text
src/components/
```

e devem ser organizados por responsabilidade.

Exemplo:

```text
components/
├── buttons/
│   ├── ButtonGeneric.vue
│   └── ButtonDelete.vue
│
├── inputs/
│   ├── InputText.vue
│   ├── InputPassword.vue
│   ├── InputSelect.vue
│   ├── InputDate.vue
│   └── InputMoney.vue
│
├── tables/
│   ├── DefaultTable.vue
│   ├── ExpandTable.vue
│   └── Pagination.vue
│
├── modals/
│   └── Modal.vue
│
├── titles/
│   ├── TitleH1.vue
│   └── TitleH2.vue
│
└── ...
```

A organização deve seguir a responsabilidade do componente.

Não colocar todos os componentes diretamente na raiz de `components` quando existir uma categoria lógica para eles.

A documentação atual já define `components` como o local dos componentes reutilizáveis e possui categorias conceituais como inputs, tabelas, botões e componentes utilitários.

---

# 12. Inputs e `data-cy`

## 12.1. Todo input deve possuir `data-cy`

Todo componente de entrada utilizado pela aplicação deve possuir um atributo:

```html
data-cy
```

Esse atributo deve possuir um identificador estável e descritivo para os testes Cypress.

Exemplo:

```vue
<q-input
  v-model="form.name"
  data-cy="product-name"
/>
```

```vue
<q-select
  v-model="form.supplierUuid"
  data-cy="shopping-supplier"
/>
```

```vue
<q-input
  v-model="form.email"
  data-cy="user-email"
/>
```

---

## 12.2. `data-cy` deve ser semântico

Evitar:

```html
data-cy="input1"
data-cy="input2"
data-cy="field"
data-cy="test"
```

Preferir:

```html
data-cy="product-name"
data-cy="product-sale-price"
data-cy="shopping-supplier"
data-cy="login-email"
data-cy="login-password"
```

O identificador deve representar a finalidade do campo.

---

## 12.3. Não utilizar seletores frágeis nos testes

O `data-cy` deve ser utilizado para evitar testes dependentes de:

* Classes CSS.
* Texto visual.
* Estrutura interna do componente.
* Índices.
* IDs gerados automaticamente.

Exemplo preferível:

```ts
cy.get('[data-cy="product-name"]')
```

em vez de:

```ts
cy.get('.q-input')
```

ou:

```ts
cy.get('.q-input:nth-child(2)')
```

---

# 13. Quasar

## 13.1. Priorizar componentes Quasar

Sempre verificar se o Quasar já fornece uma solução antes de criar um componente ou comportamento próprio.

Priorizar:

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
QNotify
QSpinner
QLoading
QSeparator
QTabs
QExpansionItem
```

e os demais recursos nativos disponíveis no framework.

---

# 14. Classes do Quasar

## 14.1. Preferir classes utilitárias do Quasar

O layout deve utilizar as classes fornecidas pelo Quasar sempre que possível.

Exemplo:

```html
<div class="row q-col-gutter-md">
  <div class="col-12 col-md-6">
    ...
  </div>
</div>
```

Utilizar recursos como:

```text
row
column
col-*
q-pa-*
q-px-*
q-py-*
q-ma-*
q-mx-*
q-my-*
q-gutter-*
flex
flex-center
items-center
justify-center
```

---

## 14.2. Evitar CSS inline para layout

Evitar:

```html
<div style="display: flex; align-items: center; padding: 16px">
```

quando o Quasar fornecer classes equivalentes.

Preferir:

```html
<div class="row items-center q-pa-md">
```

---

# 15. Evitar CSS "mockado" em `style`

Não utilizar `style` diretamente no template para criar estilos que poderiam ser resolvidos com Quasar.

Evitar:

```html
<q-card style="width: 500px; margin-top: 20px;">
```

Preferir classes:

```html
<q-card class="q-mt-md">
```

Quando existir uma classe ou recurso nativo do Quasar equivalente, ele deve ser priorizado.

---

## 15.1. CSS customizado

CSS customizado pode ser utilizado quando:

* O Quasar não oferece a funcionalidade necessária.
* Existe uma necessidade visual específica do projeto.
* O comportamento não pode ser representado adequadamente por classes utilitárias.
* Existe uma regra visual reutilizável.

Não criar CSS customizado apenas por preferência quando o Quasar já possui uma solução adequada.

---

# 16. Templates Vue

## 16.1. Evitar lógica complexa no template

Evitar:

```vue
<div>
  {{
    products.filter(product => product.active)
      .map(product => product.name)
      .join(', ')
  }}
</div>
```

Essa lógica deve ser movida para uma função ou `computed`.

Preferir:

```ts
const activeProductNamesComputed = computed(() => {
  return products.value
    .filter((product) => product.active)
    .map((product) => product.name)
    .join(', ');
});
```

```vue
<div>
  {{ activeProductNamesComputed }}
</div>
```

---

# 17. Formulários

## 17.1. Utilizar `QForm`

Formulários devem preferencialmente utilizar:

```vue
<q-form>
```

com validações bem definidas.

A aplicação já utiliza `q-form` juntamente com componentes reutilizáveis de input e botões.

---

## 17.2. Estado do formulário deve possuir tipo

Evitar:

```ts
const form = ref({});
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

# 18. Loading states

Operações assíncronas devem possuir estados de carregamento claros.

Exemplo:

```ts
const loadingProductsRef = ref<boolean>(false);
```

```ts
const fetchProducts = async (): Promise<void> => {
  loadingProductsRef.value = true;

  try {
    // request
  } finally {
    loadingProductsRef.value = false;
  }
};
```

Evitar um único:

```ts
const loading = ref(false);
```

quando a página possuir operações independentes.

Preferir nomes que expliquem o que está carregando:

```ts
loadingProductsRef
loadingSuppliersRef
loadingSubmitRef
loadingProductDetailsRef
```

---

# 19. Tratamento de erros

Erros devem ser tratados de forma previsível.

Não esconder erros silenciosamente:

```ts
try {
  await fetchProducts();
} catch {
}
```

quando o erro deveria ser apresentado ao usuário ou tratado de alguma maneira.

Utilizar os mecanismos existentes no projeto, incluindo os composables de notificação e o tratamento centralizado de erros HTTP.

A configuração central de Axios já possui interceptors para respostas de erro, incluindo tratamento de `401`, `419`, `500` e `504`.

Não duplicar no componente uma lógica que já seja responsabilidade do interceptor global.

---

# 20. Pinia

As stores devem ser utilizadas para estado realmente global ou compartilhado.

Não colocar na store:

* Estado temporário exclusivo de um formulário.
* Estado visual que pertence exclusivamente a um componente.
* Dados que não precisam sobreviver à navegação.

A aplicação utiliza Pinia para estado global e possui stores específicas para autenticação, produto, compra, venda e sistema.

---

# 21. Router

As páginas devem respeitar a arquitetura de rotas existente.

Rotas protegidas devem continuar utilizando:

```ts
meta: {
  requiresAuth: true,
}
```

Não duplicar lógica de autenticação dentro de cada página quando o guard já for responsável por isso.

O projeto possui um guard centralizado que controla acesso de usuários autenticados e não autenticados.

---

# 22. Internacionalização

Textos apresentados ao usuário devem utilizar Vue I18n quando fizerem parte da interface traduzível.

Evitar:

```vue
<q-btn label="Salvar" />
```

quando o texto precisar existir em múltiplos idiomas.

Preferir:

```vue
<q-btn :label="t('actions.save')" />
```

Não inserir strings diretamente no template quando já existir uma chave de tradução correspondente.

O projeto possui suporte a `pt-BR` e `en-US` através do Vue I18n.

---

# 23. Componentes reutilizáveis

Antes de criar um componente novo, verificar se já existe um componente reutilizável adequado.

A aplicação possui componentes próprios como:

* `InputText`
* `InputPassword`
* `InputSelect`
* `InputDate`
* `InputDateTime`
* `InputMoney`
* `InputCheckbox`
* `InputRadio`
* `InputSlider`
* `InputColor`
* `InputFile`
* `InputUpload`
* `InputUploader`
* `InputOtp`
* `InputAdvancedSearch`
* `DefaultTable`
* `ExpandTable`
* `Pagination`
* `ButtonGeneric`
* `Modal`
* `Loading`
* `Breadcrumb`
* `DefaultStepper`
* `Tabs`
* `ExpansionItem`

Não criar uma implementação paralela quando já existir um componente com a mesma responsabilidade.

---

# 24. Componentes excessivamente grandes

Durante o review, verificar componentes `.vue` que concentrem:

* Template muito extenso.
* Muitos estados.
* Muitas funções.
* Muitas requisições.
* Validações complexas.
* Modais.
* Tabelas.
* Formulários.
* Regras de negócio.

Quando houver responsabilidades claramente separáveis, considerar extração para:

* Componentes.
* Composables.
* Funções auxiliares.
* Stores, quando realmente necessário.

Não extrair código apenas para diminuir o tamanho do arquivo.

A extração deve melhorar a responsabilidade e reutilização.

---

# 25. Regras de negócio

O frontend não deve duplicar regras de negócio pertencentes ao backend.

Por exemplo, regras relacionadas a:

* Estoque.
* Custo médio.
* Lucro.
* Cancelamento.
* Integridade de operações.
* Validações de domínio.

devem continuar sendo responsabilidade da API.

O frontend pode realizar validações de experiência do usuário, mas não deve assumir que essas validações substituem as regras do backend.

O backend é responsável pelas operações de estoque dentro de transações e utiliza `lockForUpdate()` para garantir consistência.

---

# 26. Performance

Durante o review, verificar:

* Requisições HTTP duplicadas.
* `computed` desnecessariamente complexos.
* `watch` excessivos.
* Loops desnecessários no template.
* Renderização repetida de listas grandes.
* Chamadas de API dentro de loops.
* Dados que poderiam ser derivados através de `computed`.
* Componentes que poderiam ser carregados sob demanda.

Não otimizar prematuramente.

A otimização deve estar relacionada a um problema real ou potencialmente relevante.

---

# 27. Watchers

Não utilizar `watch` como primeira opção.

Antes de utilizar:

```ts
watch(...)
```

verificar se o comportamento pode ser resolvido com:

* `computed`.
* Evento explícito.
* Função chamada no momento correto.
* `v-model`.
* Lifecycle hook apropriado.

Watchers devem ser utilizados quando existe uma necessidade real de reagir a uma mudança de estado.

---

# 28. Lifecycle

Utilizar os lifecycle hooks apropriados.

Exemplo:

```ts
onMounted(() => {
  fetchProducts();
});
```

Evitar colocar várias responsabilidades não relacionadas no mesmo lifecycle hook.

Se o `onMounted` estiver crescendo excessivamente, avaliar extração da lógica.

---

# 29. Imports

Manter imports:

* Necessários.
* Organizados.
* Sem duplicações.
* Sem imports não utilizados.

Não importar módulos apenas "por garantia".

---

# 30. ESLint e Prettier

O código deve respeitar as configurações existentes de:

```text
ESLint
Prettier
TypeScript
Vue
```

Não introduzir código que dependa de desabilitar regras do ESLint sem justificativa.

Evitar:

```ts
// eslint-disable-next-line
```

quando a regra puder ser respeitada corretamente.

Se uma regra precisar realmente ser desabilitada, a justificativa deve ser clara.

---

# 31. Cypress e testabilidade

O projeto possui Cypress como dependência para testes de interface.

Todo novo componente ou fluxo interativo deve considerar testabilidade desde sua implementação.

Inputs devem possuir:

```html
data-cy
```

com nomes semânticos e estáveis.

Exemplo:

```html
data-cy="login-email"
data-cy="login-password"
data-cy="login-submit"
```

Evitar depender de:

```text
classes CSS
texto
estrutura HTML
posição do elemento
nth-child
```

para identificar elementos nos testes.

---

# 32. Requisições e Services

Quando o projeto utilizar Services, eles devem permanecer como uma camada fina para comunicação com os endpoints.

Exemplo conceitual:

```text
Page
 ↓
ProductService
 ↓
useApi
 ↓
Axios
 ↓
API
```

A documentação atual descreve `ProductService`, `ShoppingService`, `SaleService` e `AuthService` como camadas sobre os composables de API.

Não colocar regras complexas de negócio dentro do Service do frontend.

---

# 33. Critérios para comentários

Não adicionar comentários para explicar código óbvio.

Evitar:

```ts
// Incrementa a quantidade
product.amount++;
```

Comentários devem explicar:

* Decisões não óbvias.
* Workarounds.
* Restrições externas.
* Comportamentos inesperados.
* Motivos arquiteturais.

O código deve ser preferencialmente autoexplicativo.

---

# 34. Código duplicado

Durante o review, procurar duplicação real.

Exemplo:

```ts
const fetchProducts = ...
const fetchProductsForSelect = ...
const fetchProductsForTable = ...
```

Se as três funções repetirem a mesma lógica HTTP, avaliar se existe uma abstração apropriada.

Porém, não remover duplicação artificialmente quando as responsabilidades forem diferentes.

**Duplicação pequena pode ser preferível a uma abstração ruim.**

---

# 35. Segurança

Nunca confiar exclusivamente nas validações do frontend.

Não armazenar:

* Senhas.
* Tokens sensíveis desnecessários.
* Informações confidenciais em logs.
* Dados sensíveis em `console.log`.

Evitar:

```ts
console.log(response);
console.log(form);
console.log(user);
```

em código de produção.

---

# 36. Logs

Remover logs de debug antes do merge.

Evitar:

```ts
console.log(...)
console.table(...)
console.debug(...)
```

quando não forem deliberadamente necessários.

---

# 37. Checklist de Code Review

## Arquitetura

* [ ] O código está no local correto?
* [ ] A responsabilidade do arquivo está clara?
* [ ] Existe duplicação desnecessária?
* [ ] Foi criada alguma abstração desnecessária?
* [ ] A lógica deveria estar em um composable?
* [ ] A lógica deveria estar em um componente reutilizável?
* [ ] A lógica pertence realmente ao frontend?

## Vue

* [ ] Arquivo `.vue` está em PascalCase?
* [ ] O componente possui responsabilidade clara?
* [ ] O template está legível?
* [ ] Não existe lógica complexa desnecessária no template?
* [ ] `computed` está sendo usado para valores derivados?
* [ ] `watch` é realmente necessário?
* [ ] Lifecycle hooks possuem responsabilidade clara?

## TypeScript

* [ ] Não existe `any`?
* [ ] Os dados possuem tipos adequados?
* [ ] Interfaces/types representam corretamente os dados?
* [ ] Existem casts desnecessários?
* [ ] `const` é utilizado quando possível?
* [ ] Não existe `var`?
* [ ] Os parâmetros das funções possuem tipos adequados?
* [ ] Os retornos das funções assíncronas estão tipados quando necessário?

## Nomenclatura

* [ ] Variáveis possuem nomes autoexplicativos?
* [ ] Refs possuem o sufixo `Ref`?
* [ ] Computeds possuem o sufixo `Computed`?
* [ ] Funções possuem nomes autoexplicativos?
* [ ] Funções HTTP começam com `fetch`?
* [ ] Composables começam com `use`?
* [ ] Nomes utilizam camelCase quando aplicável?

## Axios/API

* [ ] A função HTTP começa com `fetch`?
* [ ] A instância centralizada do Axios está sendo utilizada?
* [ ] A requisição possui tipagem?
* [ ] Não existe requisição duplicada?
* [ ] O componente está evitando regras de negócio pertencentes ao backend?
* [ ] Erros estão sendo tratados adequadamente?

## Quasar

* [ ] Foi utilizada uma solução nativa do Quasar quando disponível?
* [ ] Foram utilizadas classes utilitárias do Quasar?
* [ ] Existe CSS inline desnecessário?
* [ ] Existe `style=""` que poderia ser substituído por classes Quasar?
* [ ] CSS customizado realmente é necessário?
* [ ] O layout utiliza corretamente o grid responsivo?

## Componentes

* [ ] O componente está dentro de `components` quando for reutilizável?
* [ ] Está dentro da categoria correta?
* [ ] O nome do arquivo está em PascalCase?
* [ ] Existe componente semelhante que poderia ser reutilizado?
* [ ] O componente possui responsabilidade única?

## Inputs

* [ ] Todo input possui `data-cy`?
* [ ] O `data-cy` é semântico?
* [ ] O `data-cy` é estável?
* [ ] O componente evita seletores frágeis?

## Internacionalização

* [ ] Textos traduzíveis utilizam Vue I18n?
* [ ] Não foram adicionadas strings fixas desnecessariamente?
* [ ] A chave de tradução possui nome adequado?

## Estado

* [ ] O estado está no componente correto?
* [ ] Pinia está sendo utilizada somente quando necessário?
* [ ] Não existe estado local desnecessariamente globalizado?
* [ ] Refs possuem nomes claros?

## Testes

* [ ] O código é testável?
* [ ] Elementos interativos possuem `data-cy`?
* [ ] O código evita dependência de classes CSS para testes?
* [ ] Novos fluxos importantes possuem cobertura de teste quando aplicável?

## Qualidade

* [ ] Não existem `console.log` de debug?
* [ ] Não existem imports não utilizados?
* [ ] ESLint continua passando?
* [ ] Prettier continua passando?
* [ ] Não existem comentários desnecessários?
* [ ] Não existem hacks ou workarounds sem justificativa?

---

# 38. Classificação dos comentários do Review

Os comentários do Code Review devem ser classificados conforme a importância.

### 🔴 Bloqueador

Problema que deve ser corrigido antes do merge.

Exemplos:

* Uso de `any` em código novo.
* Falha de tipagem que pode causar comportamento incorreto.
* Requisição HTTP incorreta.
* Vazamento de informação sensível.
* Quebra da arquitetura existente.
* Falha funcional.
* Input novo sem `data-cy`.
* Código que pode causar inconsistência ou erro grave.

### 🟠 Importante

Problema relevante que deveria ser corrigido antes do merge.

Exemplos:

* Responsabilidade incorreta.
* Duplicação significativa.
* Componente excessivamente complexo.
* Uso incorreto de Pinia.
* Requisições duplicadas.
* CSS customizado desnecessário.
* Violação clara de padrão estabelecido.

### 🟡 Melhoria

Sugestão de melhoria de qualidade.

Exemplos:

* Melhor nomenclatura.
* Simplificação de função.
* Melhor organização.
* Pequena melhoria de legibilidade.
* Melhor aproveitamento de recursos do Quasar.

### 🔵 Sugestão

Melhoria opcional que não deve bloquear o merge.

Utilizar quando existir uma alternativa potencialmente melhor, mas a implementação atual for válida.

---

# 39. Comportamento esperado do Code Review

O Code Review deve:

1. Identificar problemas reais.
2. Explicar o motivo do problema.
3. Apontar a localização específica.
4. Sugerir uma solução quando apropriado.
5. Priorizar problemas de maior impacto.
6. Evitar comentários sobre preferências pessoais sem impacto técnico.
7. Não solicitar refatorações desnecessárias.
8. Não criar regras que não estejam definidas neste documento.
9. Respeitar a arquitetura existente do projeto.
10. Considerar consistência com o restante da aplicação.

Um comentário de review deve ser objetivo.

### Exemplo ruim

> Não gostei dessa função.

### Exemplo melhor

> Essa função realiza a requisição HTTP diretamente no componente. Neste projeto, as chamadas à API devem ser encapsuladas pela camada existente de Service/composable. Sugestão: mover a requisição para `ProductService` e expor uma função `fetchProduct()` no componente.

---

# 40. Prioridade das regras

Em caso de conflito entre critérios, utilizar a seguinte prioridade:

1. **Correção funcional**
2. **Segurança**
3. **Tipagem e integridade dos dados**
4. **Arquitetura existente**
5. **Manutenibilidade**
6. **Testabilidade**
7. **Consistência de nomenclatura**
8. **Performance**
9. **Estilo e organização**

O Code Review não deve bloquear uma alteração funcionalmente correta por uma preferência puramente estética, salvo quando existir uma regra explícita deste documento.

---

# 41. Regra principal

Antes de aprovar uma implementação, verificar:

> **O código está correto, fortemente tipado, fácil de entender, testável, consistente com a arquitetura existente e utilizando os recursos nativos do Vue/Quasar antes de criar soluções próprias?**

Se a resposta for não, identificar exatamente qual regra está sendo violada e propor uma correção objetiva.
