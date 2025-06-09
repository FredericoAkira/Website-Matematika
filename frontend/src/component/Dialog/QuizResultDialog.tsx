import { PartyPopperIcon } from "lucide-react";
import { type FC } from "react";
import { Dialog } from ".";
import { ResultDetail } from "../../api/Quiz/usePostFinalResult";
import { AwardBadge } from "../AwardBadge";
import { Button } from "../Button/button";


type FalseDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: (state: string) => void;
  data?: ResultDetail;
};

export const QuizResultDialog: FC<FalseDialogProps> = ({
  open,
  setOpen,
  data,
  onClose,
}) => {
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose("apply");
    }
  };

  const color = data && data?.pointsEarned <= 50 ? "green" : data && data?.pointsEarned <= 80 ? "yellow" : "red"

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 items-center justify-center w-[80vw] xl:w-[30vw] xl:max-w-[30vw]">
        <Dialog.Header className="-mr-3">
        <div className="flex justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
                <div className="p-2 rounded-2xl bg-blue-100">
                    <PartyPopperIcon className=" text-blue-600"/>
                </div>
                <p className="font-semibold text-lg">Kamu Berhasil menyelesaikan Kuis!</p>
            </div>
          </div>
        </Dialog.Header>

        <AwardBadge
          content={`+${data?.pointsEarned ?? 50}XP`}
          color={color}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap w-full items-center justify-center text-[17px] gap-x-1 bg-blue-100 p-2 rounded-lg">
            <span className="whitespace-nowrap">Kamu berhasil menjawab</span>
            <span className="text-lg font-bold mx-1 whitespace-nowrap">{data?.correctPercentage ?? 30}%</span>
            <span className="whitespace-nowrap">pertanyaan dengan benar!</span>
          </div>
          <div className="w-full mt-2 text-[12px] justify-center text-center font-semibold">
            {data && data?.correctPercentage > 80 ? (
              <p>Hasil yang sangat hebat! Kamu siap untuk menantang tingkat selanjutnya!</p>
            ) : data && data?.correctPercentage > 60 ? (
              <p>Hasil yang bagus! Ayo lanjutkan pembelajaranmu dengan mencoba kuis lainnya!</p>
            ) : (
              <p>Usaha yang baik! Ayo pelajari materinya dan coba kembali!</p>
            )}
          </div>
          <div className="flex flex-wrap w-full items-center justify-center text-[17px] gap-x-1 mt-2">
            <span className="whitespace-nowrap">Poin kamu sekarang: </span>
            <span className="text-lg font-bold mx-1 whitespace-nowrap">{data?.updatedExp ?? 30}</span>
            <span className="whitespace-nowrap mt-0.5">XP</span>
          </div>
        </div>

        <Dialog.Footer>
          <div className="w-full flex flex-row rounded-xl justify-end items-center">
            <Button
              onClick={() => handleClose()}
              //disabled={!form.watch("interviewCategoryDownload")}
            >
              {"Tutup"}
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
