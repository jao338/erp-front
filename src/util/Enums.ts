export enum Mask {
  Cnpj = '##.###.###/####-##',
  Cpf = '###.###.###-##',
  TelefoneFixo = '(##) ####-####',
  TelefoneMovel = '(0##) #####-####',
  Cep = '##.###-###',
}

export enum FieldType {
  TextField = 'TextField',
  SelectField = 'SelectField',
  ObjectField = 'ObjectField',
  Unknown = 'Unknown'
}

export enum ButtonSizeType {
  ExtraLarge = 'xl',
  Large = 'lg',
  Medium = 'md',
  Small = 'sm',
  ExtraSmall = 'xs',
}
export enum TextSizeType {
  TextH1 = 'text-h1',
  TextH2 = 'text-h2',
  TextH3 = 'text-h3',
  TextH4 = 'text-h4',
  TextH5 = 'text-h5',
  TextH6 = 'text-h6',
  TextBody1 = 'text-body1',
  TextBody2 = 'text-body2',
  TextSubtitle1 = 'text-subtitle1',
  TextSubtitle2 = 'text-subtitle2',
  TextCaption = 'text-caption',
}

export enum Lang {
  Portuguese = 'pt-BR',
  English = 'en-US',
}

export enum PersonType {
  Individual = 1,
  Company    = 2,
}
