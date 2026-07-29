"use client";

type EditStaffFormProps = {
  editName: string;
  editCar: string;
  editProgress: number;
  editAuditionDate: string;
  editChallengeStatement: string;
  editStatus: string;
  isSavingEdit: boolean;
  onChangeName: (value: string) => void;
  onChangeCar: (value: string) => void;
  onChangeProgress: (value: number) => void;
  onChangeAuditionDate: (value: string) => void;
  onChangeChallengeStatement: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditStaffForm({
  editName,
  editCar,
  editProgress,
  editAuditionDate,
  editChallengeStatement,
  editStatus,
  isSavingEdit,
  onChangeName,
  onChangeCar,
  onChangeProgress,
  onChangeAuditionDate,
  onChangeChallengeStatement,
  onChangeStatus,
  onSave,
  onCancel,
}: EditStaffFormProps) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="mb-4 text-lg font-black text-black">
        スタッフ情報を編集
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            名前
          </label>

          <input
            type="text"
            value={editName}
            onChange={(event) => onChangeName(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              車
            </label>

            <input
              type="text"
              value={editCar}
              onChange={(event) => onChangeCar(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              進捗
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={editProgress}
              onChange={(event) =>
                onChangeProgress(Number(event.target.value))
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            オーディション日
          </label>

          <input
            type="date"
            value={editAuditionDate}
            onChange={(event) =>
              onChangeAuditionDate(event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            挑戦宣言
          </label>

          <textarea
            value={editChallengeStatement}
            onChange={(event) =>
              onChangeChallengeStatement(event.target.value)
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ステータス
          </label>

          <select
            value={editStatus}
            onChange={(event) => onChangeStatus(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-red-500"
          >
            <option value="MODEL_CHALLENGE">100人モデル挑戦中</option>
            <option value="MODEL_COMPLETE">100人モデル達成</option>
            <option value="AUDITION">オーディション</option>
            <option value="STYLIST">スタイリスト</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={isSavingEdit}
            className="flex-1 rounded-xl bg-red-600 px-5 py-4 font-bold text-white disabled:opacity-50"
          >
            {isSavingEdit ? "保存中..." : "変更を保存"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSavingEdit}
            className="rounded-xl border border-gray-300 bg-white px-5 py-4 font-bold text-gray-700 disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}