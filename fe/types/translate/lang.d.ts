export type LangsValue =
  | "BG"
  | "ZH"
  | "CS"
  | "DA"
  | "NL"
  | "EN"
  | "ET"
  | "FI"
  | "FR"
  | "DE"
  | "EL"
  | "HU"
  | "IT"
  | "JA"
  | "LV"
  | "LT"
  | "PL"
  | "PT"
  | "RO"
  | "RU"
  | "SK"
  | "SL"
  | "ES"
  | "SV";

export interface LangsChoice {
  from: LangsValue | "auto";
  to: LangsValue;
}
