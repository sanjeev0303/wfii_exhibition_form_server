export class CreateExhibitionDto {
  companyName!: string;
  companyDescription!: string;
  companyAbout!: string;
  productName!: string;
  productDescription!: string;
  productAbout!: string;
  productVideoUrl?: string; // Optional external video link
}

export class ExhibitionResponseDto {
  id!: string;
  companyName!: string;
  companyDescription!: string;
  companyPosterUrl!: string;
  companyAbout!: string;
  productName!: string;
  productDescription!: string;
  productAbout!: string;
  productImages!: string[];
  productVideoUrl?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
