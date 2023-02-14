#include <bits/stdc++.h>
using namespace std;
#define FAST_IO ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0); cerr.tie(0)
typedef long long ll;
#define mp make_pair
#define gl getline
#define pb push_back
#define eb emplace_back
#define ob pop_back
#define sz(s) ((int)(s.size()))
#define forn(i,a,b) for (ll i = a; i < b; i++)
#define forr(i,a,b) for (ll i = a; i >= b; i--)
#define fora(i, n) for(auto i:n)
#define Len 100005
#define A189 4005
const double pi=3.14159265358979323846;
const int MOD = 1000000007;
void solve()
{
    int n,a; 
    // vector<int> a(3);
    cin >> n;
    // for(int i=0; i<3; i++) cin >> a[i];
    // sort(a.begin(),a.end());
    // for(int i=0; i<3; i++) cout << a[i] << " "; cout << endl;
    vector<int> dp(4005);
    int ans = 0;
    dp[0] = 0;
    for(int i=0; i<3; i++)
    {
        cin >> a;
        for(int j=a;j<=n;j++)
            if(dp[j-a]!=0||j-a==0)
                dp[j]=max(dp[j],dp[j-a]+1);

    }
    cout << dp[n] << endl;
}

// 3997
// 4 7 11
// 
int main()
{
    FAST_IO;
	// int tt; cin >> tt; while(tt--) solve();
	solve();
	// freopen("input.txt", "r", stdin); freopen("output.txt", "w", stdout);
}
