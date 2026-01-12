using DocsVision.BackOffice.ObjectModel;
using System;

namespace TrinityHelp
{
    public static class Constants
    {

        public static class Visitor
        {
            public static readonly Guid ID = new Guid("eaad7975-8a5e-4ece-9350-75bb62c01aa7");

            public static readonly Guid MainKindID = new Guid("315315DC-3DDB-48A9-A945-FF33D1112F0A");
            public static readonly Guid MainStateID = new Guid("49324BFA-AB1E-47A8-833E-4EF936BAFA38");
            


            public static class System
            {
                public static readonly Guid ID = new Guid("eedc19d7-6b37-427c-b384-badb9ecaa0b3");

                public static string Kind = "Kind";
                public static string State = "State";
            }

            public static class MainInfo
            {
                public static readonly Guid ID = new Guid("f1324f55-569b-4d48-8b70-abdb4e9966b0");

                public static string Links = "Links";
                public static string Passport = "Passport";
                public static string MainPhoneNumber = "MainPhoneNumber";
                public static string BirthDate = "BirthDate";
                public static string FirstName = "FirstName";
            }

            public static class Visits
            {
                public static readonly Guid ID = new Guid("abe1c77a-460f-4bb6-a529-7b86b2000d9b");

                public static string Visit = "Visit";
            }

            public static class Recipients
            {
                public static readonly Guid ID = new Guid("0899d0d9-9eae-4966-89ef-9177bcc5e1a4");

                public static string FirstName = "FirstName";
                public static string LastName = "LastName";
                public static string Relationship = "Relationship";
            }
        }

        public static class Visit
        {
            public static readonly Guid ID = new Guid("dc3a52f8-5aa1-4b13-ade0-e4dcddaaada0");

            public static readonly Guid MainKindID = new Guid("9FB74B2F-1408-4F48-8A2F-D04857F50744");
            public static readonly Guid MainStateID = new Guid("9C30344C-BEC9-4624-9747-753BDD6D5009");
            public static readonly Guid NumerationRuleID = new Guid("{A9668B56-6E2D-486D-91E7-14CD8D2928EF}");


            public static class System
            {
                public static readonly Guid ID = new Guid("b263c576-73b1-4472-b9eb-3dbac5de7d08");

                public static string Kind = "Kind";
                public static string State = "State";
            }

            public static class MainInfo
            {
                public static readonly Guid ID = new Guid("48d3631f-b22c-4af2-bad5-030838eb2ca0");

                public static string Visitor = "Visitor";
                public static string DateTime = "DateTime";
                public static string Duty = "Duty";
                public static string Comment = "Comment";
                public static string Number = "Number";
            }

            public static class Items
            {
                public static readonly Guid ID = new Guid("23d9f4db-9236-4bc8-a695-e2b888a91701");
                
                public static string ItemCode = "ItemCode";
                public static string ItemName = "ItemName";
                public static string Count = "Count";
                public static string Recipient = "Recipient";
                public static string Comment = "Comment";
                public static string Source = "Source";
            }

            public static class Numbers
            {
                public static readonly Guid ID = new Guid("d0aa7747-d108-4f8d-8072-0cd92688229f");
                public static string Number = "Number";
            }
        }

        public static class Order
        {
            public static readonly Guid ID = new Guid("deb1c58e-42a1-472b-8a32-c9c2f62917a8");

            public static readonly Guid MainKindID = new Guid("D0A6196B-3D9F-4E00-BBA7-2EEEAB6D24E2");
            public static readonly Guid FirstStateID = new Guid("C9B42F95-BA2F-4720-A56F-8CA987AED7A9");



            public static class System
            {
                public static readonly Guid ID = new Guid("16d0a697-cd83-4d24-9e92-6aa7a57391a6");

                public static string Kind = "Kind";
                public static string State = "State";
            }

            public static class MainInfo
            {
                public static readonly Guid ID = new Guid("74560b03-924e-4464-877c-ded57d1822d8");
                public const string Visitor = "Visitor";
            }
        }


        public static class Accounting
        {
            public static readonly Guid ID = new Guid("E4C8F533-C826-4D3B-B586-E3090C939A69");

            public static string Contract = "Contract";
            public static string DocumentDate = "DocumentDate";
            public static string Partner = "Partner";
            public static string OriginalReceived = "OriginalReceived";
            public static string Number = "Number";
            public static string TransferDocumentType = "TransferDocumentType";
            public static string OurSignReceived = "OurSignReceived";
            public static string Electronic = "Electronic";
            public static string PartnerSignReceived = "PartnerSignReceived";
            public static string Summ = "Summ";

            public static class TransferDocumentTypes
            {
                public static int Act = 0;
                public static int Other = 3;
                public static int Torg12 = 2;
                public static int UPD = 1;
            }
        }

        public static class Payment
        {
            public static readonly Guid ID = new Guid("9E80FB00-BB7B-4FA2-B656-C055352380DF");

            public static string Account = "Account";

            public static string TransferDocument = "TransferDocument";
        }

        public static class Staff
        {
            public static readonly Guid ID = new Guid("3D2CFC3C-A8C7-4285-8280-AAD1181A1234");

            public static string Employee = "Employee";
        }

        public static class Kinds
        {
            public static Guid TransferDocument = new Guid("D7250B47-AB32-4739-BC94-05D8434D428E");
            public static Guid Payment = new Guid("A9E2BAA9-D661-44E2-AE2E-92DDC2E4BD73");
            public static Guid Contract = new Guid("061924E0-58F1-4FAA-97EF-72CCF2ED58AD");
            public static Guid Account = new Guid("631185B0-AB62-44B4-B927-35D0DAB9100C");
            public static Guid AccountingDocument = new Guid("C98BED26-45F6-4F25-A76F-90138137AD3A");
            
            public static Guid StaffContract = new Guid("786C1250-7AE9-4D68-9102-B43F3358782F");
            public static Guid StaffContractAddition = new Guid("F42F17AD-F279-4E6C-B7B1-D77B9B9617EC");
            public static Guid StaffStatement = new Guid("8108C6D0-23CD-4088-9B49-EFB91DBE8936");
            public static Guid StaffOrder = new Guid("E4125AC1-73C8-48BC-8A3D-6B4AC0A3C884");
            public static Guid StaffVacationSchedule = new Guid("C7C0ED65-8659-401F-AD66-A50CA9E5527C");
        }
    }

}
