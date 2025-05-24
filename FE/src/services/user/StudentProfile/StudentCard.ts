export class StudentCard {
  cardId: string;
  studentCardUrl: string;
  isDeleted: boolean;

  constructor(cardId: string, studentCardUrl: string, isDeleted: boolean) {
    this.cardId = cardId;
    this.studentCardUrl = studentCardUrl;
    this.isDeleted = isDeleted;
  }
  getCardId(): string {
    return this.cardId;
  }

  setCardId(value: string): void {
    this.cardId = value;
  }

  getStudentCardUrl(): string {
    return this.studentCardUrl;
  }

  setStudentCardUrl(value: string): void {
    this.studentCardUrl = value;
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }

  setIsDeleted(value: boolean): void {
    this.isDeleted = value;
  }

}
