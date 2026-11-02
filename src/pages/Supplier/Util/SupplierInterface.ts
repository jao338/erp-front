import type { Person } from 'src/util/Interface';

export type Supplier = Person;

export interface SupplierFilter {
  nome: string;
  email: string;
  cnpj: string;
  cpf: string;
  telefone: string;
}
