export type StaffStatus =
  | "MODEL_CHALLENGE"
  | "MODEL_COMPLETE"
  | "AUDITION"
  | "STYLIST";

export interface Staff {
  id: string;

  // 基本情報
  name: string;
  photoURL: string;

  // モデル進捗
  progress: number;

  // 現在のステータス
  status: StaffStatus;

  // 挑戦宣言
  challengeStatement: string;

  // 試験日
  auditionDate?: string;

  // デビュー日
  debutDate?: string;

  // レースアイコン
  car: string;

  createdAt?: Date;
  updatedAt?: Date;
}