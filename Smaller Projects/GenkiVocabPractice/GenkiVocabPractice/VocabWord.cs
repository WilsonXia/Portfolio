using System;
using System.Collections.Generic;
/*
 * VocabWord
 *  -string english
 *  +string Eng
 *      Holds the english word
 *  -string hiragana
 *  +string Hiragana
 *      Holds the word in hiragana
 *  -ToString()
 *      returns (Eng, Hiragana)
 */

namespace GenkiVocabPractice
{
    public class VocabWord
    {
        // Fields
        string eng;
        string hir;

        // Properties
        public string English 
        {
            get { return eng; }
        }
        public string Hiragana 
        {
            get { return hir; }
        }

        // Methods + Constructor

        public VocabWord(string e, string h) 
        {
            eng = e;
            hir = h;
        }

        public override string ToString()
        {
            return eng + ", " + hir;
        }
    }
}
