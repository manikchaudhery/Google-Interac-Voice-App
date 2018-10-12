import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.apache.commons.codec.binary.Base64;

public class Keygen {

    public static void main(String[] args) throws NoSuchAlgorithmException {

        String salt = "abcde";
        String secretKey = "Q_Si_uvUX0Db3gKCMcRIbMIYB0u2llOkff1k0VISgEo";

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        System.out.println(new String(Base64.encodeBase64(md.digest((salt + ':' + secretKey).getBytes()))));

    }

}
