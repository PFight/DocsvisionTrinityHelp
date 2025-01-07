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

        public static class Kinds
        {
            public static Guid TransferDocument = new Guid("D7250B47-AB32-4739-BC94-05D8434D428E");
            public static Guid Payment = new Guid("A9E2BAA9-D661-44E2-AE2E-92DDC2E4BD73");
            public static Guid Contract = new Guid("061924E0-58F1-4FAA-97EF-72CCF2ED58AD");
            public static Guid Account = new Guid("631185B0-AB62-44B4-B927-35D0DAB9100C");
            public static Guid AccountingDocument = new Guid("C98BED26-45F6-4F25-A76F-90138137AD3A");
        }
    }
}
