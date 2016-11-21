using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {

        DriveInfo[] allDrives = DriveInfo.GetDrives();

        foreach (DriveInfo d in allDrives)
        {
            if (args.Length != 1)
            {
                Console.WriteLine("Usage: DrvInfo Drive");
                return;
            }
            //Console.WriteLine("d.name={0}, args[0]={1}", d.Name, args[0]);
            if (!d.Name.StartsWith(args[0].ToUpper()))
                continue;
            if (!d.IsReady)
            {
                return;
            }
            Console.WriteLine("INSERT INTO Volume VALUES (DEFAULT, {0}, {1}, '{2}');",
                d.TotalSize>>10, d.TotalFreeSpace>>10, d.VolumeLabel);
            return;
            /*
            Console.WriteLine("Drive {0}", d.Name);
            Console.WriteLine("  Drive type: {0}", d.DriveType);
            if (d.IsReady == true)
            {
                Console.WriteLine("  Volume label: {0}", d.VolumeLabel);
                Console.WriteLine("  File system: {0}", d.DriveFormat);
                Console.WriteLine(
                    "  Available space to current user:{0, 15} bytes",
                    d.AvailableFreeSpace);

                Console.WriteLine(
                    "  Total available space:          {0, 15} bytes",
                    d.TotalFreeSpace);

                Console.WriteLine(
                    "  Total size of drive:            {0, 15} bytes ",
                    d.TotalSize);
            }
             * */
        }
        Console.WriteLine("Windoze is dumb");
    }
}