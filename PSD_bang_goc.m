function y = PSD_bang_goc(A,T,N)
    s=[];
    t=0:0.1:T;
    s=A.*sin(2*pi*t);

    n=[];
    for i=1:length(t)
        n(i)=N*random('Normal',0,1);
    end
    
y=s+n;

plot(t,s,'g','linewidth',2);
axis([0 T+1 -(A+max(n)+1) (A+max(n)+1)]);
hold on;

plot(t,n,'r--');
axis([0 T+1 -(A+max(n)+1) (A+max(n)+1)]);

plot(t,y,'k-.', 'linewidth',2);
axis([0 T+1 -(A+max(n)+1) (A+max(n)+1)]);

hold off;
grid on;
end