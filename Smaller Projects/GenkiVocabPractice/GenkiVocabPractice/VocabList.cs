using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

/*  VocabList
 *  -string topic
 *      Name of the List
 *  -List vocabulary
 *      List that holds the Vocab
 *  -List<VocabWord> Shuffle(Random rng)
 *      Shuffles the list so it can be used for quizing
 *  -void ImportList()
 *      Sets up the list of Vocab
 *  -void PrintList()
 *      Calls each VocabWord's ToString neatly.
 */

namespace GenkiVocabPractice
{
    public class VocabList
    {
        // Fields
        string topic;
        List<VocabWord> words;

        // Properties
        public string Topic { get { return topic; } set { topic = value; } }
        public List<VocabWord> Words { get { return words; } }
        public int Count { get { return words.Count; } }
        public VocabWord this[int i] { get { return words[i]; } }

        // Methods + Constructor
        public VocabList(string topic)
        {
            this.topic = topic;
            words = new List<VocabWord>();
        }
        public VocabList() 
        {
            this.topic = "Blank";
            words = new List<VocabWord>();
        }
        public VocabList Shuffle(Random rng) 
        {
            VocabList shuffled = new VocabList();
            List<VocabWord> copy = new List<VocabWord>();
            int num;
            for(int i = 0; i < words.Count; i++) 
            {
                copy.Add(words[i]);
            }
            while(copy.Count > 0) 
            {
                num = rng.Next(0, copy.Count);
                shuffled.AddWord(copy[num]);
                copy.RemoveAt(num);
            }
            return shuffled;
        }

        public void ImportList(string path) 
        {
            StreamReader reader;
            string line;

            try 
            {
                reader = new StreamReader(string.Format("../../../lists/{0}.txt", path));
                line = reader.ReadLine();
                while(line != null)
                {
                    string[] strings = line.Split(',');
                    VocabWord word = new VocabWord(strings[0], strings[1]);
                    AddWord(word);
                    line = reader.ReadLine();
                    //
                }
                topic = path;
                Console.WriteLine("Successfully imported {0}.", path);
                reader.Close();
            }
            catch(Exception e)
            {
                //oops!
                Console.WriteLine("Ooops!\n" + e.Message + "\n");
            }
        }

        public void AddWord(VocabWord word) 
        {
            words.Add(word);
        }

        public void PrintList() 
        {
            foreach(VocabWord w in words) 
            {
                Console.WriteLine("- {0}".PadLeft(10), w);
            }
        }

        public bool isEmpty() 
        {
            return words.Count == 0;
        }
        public override string ToString()
        {
            return topic.ToUpper();
        }
    }
}
